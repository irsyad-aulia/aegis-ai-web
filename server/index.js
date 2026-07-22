const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const axios = require('axios');
const db = require('./db'); // Import koneksi database
const auth = require('./auth');
const passport = require('passport');
const { analyzeCode } = require('./core/aegisAnalyzer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Mount auth router
app.use('/api/auth', auth.router);

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi multer untuk unggahan file
const upload = multer({ dest: uploadDir });

app.get('/api/status', (req, res) => {
  res.json({ status: 'Aegis Core is online', timestamp: new Date() });
});

// Endpoint Kuota dan Upgrade
app.get('/api/user/quota', auth.verifyToken, async (req, res) => {
  try {
    const userRow = await db.getQuery('SELECT is_pro FROM users WHERE id = ?', [req.user.id]);
    const isPro = userRow && userRow.is_pro === 1;
    const scanCount = await db.getQuery('SELECT COUNT(*) as count FROM scans WHERE user_id = ?', [req.user.id]);
    const used = scanCount ? scanCount.count : 0;
    res.json({ isPro, used, max: 10 });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil kuota' });
  }
});

app.post('/api/user/upgrade', auth.verifyToken, async (req, res) => {
  try {
    await db.runQuery('UPDATE users SET is_pro = 1 WHERE id = ?', [req.user.id]);
    res.json({ success: true, message: 'Berhasil upgrade ke paket Pro!' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal upgrade' });
  }
});

// Endpoint Utama AI Scan
app.post('/api/scan', auth.verifyToken, upload.array('codeFiles', 1000), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah' });
    }

    // Cek Kuota
    const userRow = await db.getQuery('SELECT is_pro FROM users WHERE id = ?', [req.user.id]);
    const isPro = userRow && userRow.is_pro === 1;
    
    if (!isPro) {
      const scanCount = await db.getQuery('SELECT COUNT(*) as count FROM scans WHERE user_id = ?', [req.user.id]);
      if (scanCount && scanCount.count >= 10) {
        // Bersihkan file
        for (const file of req.files) {
           if (fs.existsSync(file.path)) {
               try { fs.unlinkSync(file.path); } catch (e) {}
           }
        }
        return res.status(403).json({ error: 'QUOTA_EXCEEDED' });
      }
    }

    let filesToScan = [];

    // Proses setiap file yang diunggah
    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExts = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.html', '.php', '.cs', '.cpp'];
      
      if (ext === '.zip') {
        // [ENTERPRISE FIX]: Baca ZIP langsung di RAM, JANGAN ekstrak ke Disk (Terlalu lambat untuk 46k file)
        console.log(`[Aegis Core] Memindai ZIP di Memory: ${file.originalname}...`);
        const zip = new AdmZip(file.path);
        const zipEntries = zip.getEntries();
        
        for (const zipEntry of zipEntries) {
          if (zipEntry.isDirectory) continue;
          
          const entryName = zipEntry.entryName;
          
          // Abaikan folder berat di dalam ZIP
          const isJunk = ['node_modules/', '.git/', '.next/', 'dist/', 'build/', 'coverage/']
                         .some(junk => entryName.includes(junk));
          if (isJunk) continue;

          const extName = path.extname(entryName).toLowerCase();
          if (allowedExts.includes(extName) || extName === '') {
            try {
              const content = zipEntry.getData().toString('utf8');
              filesToScan.push({ name: entryName, content: content });
            } catch (e) {
              console.log('Gagal membaca file dari dalam ZIP:', entryName);
            }
          }
        }
      } else {
        // File biasa
        const extName = path.extname(file.originalname).toLowerCase();
        if (allowedExts.includes(extName) || extName === '') {
          const content = fs.readFileSync(file.path, 'utf8');
          filesToScan.push({ name: file.originalname, content: content });
        }
      }
    }

    console.log(`[Aegis Core] Menganalisis ${filesToScan.length} file kode (Sampah diabaikan)...`);

    if (filesToScan.length > 3000) {
      return res.status(400).json({ 
        error: `ZIP terlalu besar! Ditemukan ${filesToScan.length.toLocaleString()} file kode valid. Batas maksimal untuk versi ini adalah 3.000 file demi stabilitas AI.` 
      });
    }

    // [LLM UPGRADE]: Mengirimkan seluruh file kode sekaligus ke Gemini AI
    let report;
    try {
      report = await analyzeCode(filesToScan);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Gagal berkomunikasi dengan AI Engine' });
    }

    // Bersihkan file unggahan awal (zip / files)
    for (const file of req.files) {
       if (fs.existsSync(file.path)) {
           try { fs.unlinkSync(file.path); } catch (e) {}
       }
    }

    // Menambahkan nama file ke laporan akhir
    report.fileName = req.files.length > 1 ? 'Multiple Files' : req.files[0].originalname;
    report.scanId = report.scanId || `MANUAL-${Date.now()}`;

    // [DATABASE]: Simpan hasil ke database SQLite
    let critical = 0, warning = 0;
    report.vulnerabilities.forEach(v => {
      if (v.severity === 'critical') critical++;
      else if (v.severity === 'high' || v.severity === 'warning') warning++;
    });

    try {
      await db.runQuery(
        `INSERT INTO scans (user_id, scan_id, repo_name, total_vulnerabilities, severity_critical, severity_warning, overall_score, status, raw_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, report.scanId, report.fileName, report.vulnerabilitiesFound, critical, warning, report.overallScore, report.status, JSON.stringify(report)]
      );
      console.log(`[DB] Berhasil menyimpan hasil scan ${report.scanId} ke database.`);
    } catch (dbErr) {
      console.error(`[DB] Gagal menyimpan ke database:`, dbErr.message);
    }

    res.json(report);

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Internal server error during analysis' });
  }
});

// Endpoint untuk GitHub Repository Scan
app.post('/api/scan-github', auth.verifyToken, async (req, res) => {
  try {
    // Cek Kuota
    const userRow = await db.getQuery('SELECT is_pro FROM users WHERE id = ?', [req.user.id]);
    const isPro = userRow && userRow.is_pro === 1;
    
    if (!isPro) {
      const scanCount = await db.getQuery('SELECT COUNT(*) as count FROM scans WHERE user_id = ?', [req.user.id]);
      if (scanCount && scanCount.count >= 10) {
        return res.status(403).json({ error: 'QUOTA_EXCEEDED' });
      }
    }

    const { repoUrl } = req.body;
    if (!repoUrl || !repoUrl.includes('github.com')) {
      return res.status(400).json({ error: 'URL GitHub tidak valid.' });
    }

    console.log(`[Aegis Core] Menghubungi GitHub API: ${repoUrl}`);

    // Ekstrak owner dan repo dari URL
    // Format: https://github.com/owner/repo
    const urlParts = repoUrl.split('github.com/')[1]?.split('/');
    if (!urlParts || urlParts.length < 2) {
      return res.status(400).json({ error: 'Format URL repositori tidak dikenali.' });
    }

    const owner = urlParts[0];
    const repo = urlParts[1].replace('.git', '');

    // Coba download branch "main" terlebih dahulu, jika gagal coba "master"
    let zipBuffer;
    try {
      const response = await axios.get(`https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`, {
        responseType: 'arraybuffer'
      });
      zipBuffer = response.data;
    } catch (e) {
      try {
        const responseMaster = await axios.get(`https://github.com/${owner}/${repo}/archive/refs/heads/master.zip`, {
          responseType: 'arraybuffer'
        });
        zipBuffer = responseMaster.data;
      } catch (err) {
        return res.status(404).json({ error: 'Repositori tidak ditemukan atau bersifat Private. Pastikan repositori Publik dan menggunakan branch main/master.' });
      }
    }

    console.log(`[Aegis Core] Berhasil mengunduh repositori. Membaca ZIP di Memory...`);
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();
    let filesToScan = [];
    const allowedExts = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.html', '.php', '.cs', '.cpp'];

    for (const zipEntry of zipEntries) {
      if (zipEntry.isDirectory) continue;
      
      const entryName = zipEntry.entryName;
      
      const isJunk = ['node_modules/', '.git/', '.next/', 'dist/', 'build/', 'coverage/']
                     .some(junk => entryName.includes(junk));
      if (isJunk) continue;

      const extName = path.extname(entryName).toLowerCase();
      if (allowedExts.includes(extName) || extName === '') {
        try {
          const content = zipEntry.getData().toString('utf8');
          filesToScan.push({ name: entryName, content: content });
        } catch (e) {}
      }
    }

    console.log(`[Aegis Core] Menganalisis ${filesToScan.length} file kode dari GitHub...`);

    if (filesToScan.length > 3000) {
      return res.status(400).json({ 
        error: `Repositori terlalu besar! Ditemukan ${filesToScan.length.toLocaleString()} file kode valid. Batas maksimal untuk versi ini adalah 3.000 file demi stabilitas AI.` 
      });
    }

    // [LLM UPGRADE]: Mengirimkan seluruh file kode sekaligus ke Gemini AI
    let report;
    try {
      report = await analyzeCode(filesToScan);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Gagal berkomunikasi dengan AI Engine' });
    }

    report.scanId = `GH-${Date.now()}`;
    report.fileName = `${owner}/${repo}`;
    report.aiSummary = `Mesin Aegis Gemini AI telah membedah ${filesToScan.length} file dari repositori GitHub ${repo}. ${report.vulnerabilitiesFound > 0 ? `Ditemukan ${report.vulnerabilitiesFound} celah keamanan riil berdasarkan logika AI.` : `Kode sangat aman.`}`;

    // [DATABASE]: Simpan hasil ke database SQLite
    let critical = 0, warning = 0;
    report.vulnerabilities.forEach(v => {
      if (v.severity === 'critical') critical++;
      else if (v.severity === 'high' || v.severity === 'warning') warning++;
    });

    try {
      await db.runQuery(
        `INSERT INTO scans (user_id, scan_id, repo_name, total_vulnerabilities, severity_critical, severity_warning, overall_score, status, raw_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, report.scanId, report.fileName, report.vulnerabilitiesFound, critical, warning, report.overallScore, report.status, JSON.stringify(report)]
      );
      console.log(`[DB] Berhasil menyimpan hasil GitHub scan ${report.scanId} ke database.`);
      
      // Tambahkan Notifikasi
      const notifMsg = `Sistem memindai repositori ${repo} dan menemukan ${report.vulnerabilitiesFound} celah. Skor keseluruhan: ${report.overallScore}.`;
      await db.runQuery(
        `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
        [req.user.id, notifMsg]
      );
    } catch (dbErr) {
      console.error(`[DB] Gagal menyimpan ke database:`, dbErr.message);
    }

    res.json(report);

  } catch (error) {
    console.error('GitHub scan error:', error);
    res.status(500).json({ error: 'Internal server error saat memproses repositori GitHub' });
  }
});

// Endpoint untuk Dashboard
app.get('/api/dashboard/stats', auth.verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Data Trend 30 Hari Terakhir (Mengelompokkan berdasarkan tanggal)
    const trendRows = await db.allQuery(`
      SELECT DATE(timestamp) as date, SUM(total_vulnerabilities) as count
      FROM scans
      WHERE user_id = ? AND timestamp >= date('now', '-30 days')
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `, [userId]);

    // Karena data bisa kosong/bolong harinya, kita buat 7 hari terakhir sebagai default (jika data sedikit)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const shortDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      
      const found = trendRows.find(r => r.date === dateStr);
      trendData.push({
        name: shortDay,
        count: found ? found.count : 0,
        fullDate: dateStr
      });
    }

    // 2. Daftar Repositori Terakhir (Group By Repo Name, Ambil yang terbaru)
    const repos = await db.allQuery(`
      SELECT s.*
      FROM scans s
      INNER JOIN (
          SELECT repo_name, MAX(timestamp) as max_time
          FROM scans
          WHERE user_id = ?
          GROUP BY repo_name
      ) latest ON s.repo_name = latest.repo_name AND s.timestamp = latest.max_time
      WHERE s.user_id = ?
      ORDER BY s.timestamp DESC
      LIMIT 10
    `, [userId, userId]);

    // Memformat daftar repositori untuk Dashboard
    const formattedRepos = repos.map(r => {
      // Hitung waktu berlalu
      const diffMs = Date.now() - new Date(r.timestamp).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      let timeKey = diffMins < 60 ? `${diffMins}m` : `${Math.floor(diffMins/60)}h`;

      return {
        scanId: r.scan_id,
        name: r.repo_name,
        statusKey: r.status, // clean, warning, critical
        timeKey: timeKey, // Butuh disesuaikan jika ingin di-translate
        timeAgoStr: diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins/60)}h ago`,
        issues: r.total_vulnerabilities
      };
    });

    // 3. Distribusi Status (Pie Chart) - Dari data repo terbaru
    let clean = 0, warning = 0, critical = 0;
    repos.forEach(r => {
      if (r.status === 'clean') clean++;
      else if (r.status === 'warning') warning++;
      else if (r.status === 'critical') critical++;
    });

    // Jika belum ada data sama sekali, berikan data mock minimal agar grafik tidak error
    if (repos.length === 0) {
      clean = 1; // dummy data
    }

    const pieData = [
      { name: 'Clean', value: clean, color: '#10b981' },
      { name: 'Warning', value: warning, color: '#f59e0b' },
      { name: 'Critical', value: critical, color: '#ef4444' }
    ].filter(item => item.value > 0);

    // 4. Statistik Global (Berdasarkan data repo terbaru)
    let avgScore = 0;
    let totalIssues = 0;
    if (repos.length > 0) {
      const sumScore = repos.reduce((sum, r) => sum + r.overall_score, 0);
      avgScore = Math.round(sumScore / repos.length);
      totalIssues = repos.reduce((sum, r) => sum + r.total_vulnerabilities, 0);
    } else {
      avgScore = 100;
    }

    res.json({
      trendData,
      repos: formattedRepos,
      pieData,
      global: {
        score: avgScore,
        totalRepos: repos.length,
        totalIssues: totalIssues
      }
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk mendapatkan Detail Scan berdasarkan ID
app.get('/api/scan/:scanId', auth.verifyToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const row = await db.getQuery('SELECT raw_data FROM scans WHERE scan_id = ? AND user_id = ?', [scanId, req.user.id]);
    if (!row || !row.raw_data) {
      return res.status(404).json({ error: 'Data laporan tidak ditemukan di database atau Anda tidak memiliki akses.' });
    }
    const reportData = JSON.parse(row.raw_data);
    res.json(reportData);
  } catch (error) {
    console.error('Get Scan Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint untuk Notifications
app.get('/api/notifications', auth.verifyToken, async (req, res) => {
  try {
    const notifs = await db.allQuery('SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20', [req.user.id]);
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil notifikasi' });
  }
});

app.post('/api/notifications/read', auth.verifyToken, async (req, res) => {
  try {
    await db.runQuery('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Gagal update status notifikasi' });
  }
});

// Endpoint untuk Integrations
app.get('/api/integrations', auth.verifyToken, async (req, res) => {
  try {
    const integrations = await db.allQuery('SELECT provider, is_connected FROM integrations WHERE user_id = ?', [req.user.id]);
    
    // Default fallback
    const results = {
      github: { isConnected: true }, // Default always connected for core app
      slack: { isConnected: false },
      jira: { isConnected: false },
      gitlab: { isConnected: false },
      discord: { isConnected: false }
    };
    
    integrations.forEach(i => {
      if (results[i.provider] !== undefined && i.provider !== 'github') {
        results[i.provider].isConnected = i.is_connected === 1;
      }
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data integrasi' });
  }
});

app.post('/api/integrations/toggle', auth.verifyToken, async (req, res) => {
  try {
    const { provider, isConnected } = req.body;
    if (!['github', 'slack', 'jira', 'gitlab', 'discord'].includes(provider)) {
      return res.status(400).json({ error: 'Provider tidak valid' });
    }
    
    if (provider === 'github') {
      return res.status(400).json({ error: 'Koneksi GitHub App bersifat inti dan tidak dapat diputus.' });
    }

    const value = isConnected ? 1 : 0;
    
    await db.runQuery(`
      INSERT INTO integrations (user_id, provider, is_connected) 
      VALUES (?, ?, ?) 
      ON CONFLICT(user_id, provider) DO UPDATE SET is_connected = ?, updated_at = CURRENT_TIMESTAMP
    `, [req.user.id, provider, value, value]);
    
    res.json({ success: true, provider, isConnected });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengubah status integrasi' });
  }
});

// Global Error Handler for debugging
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).send("Express Error: " + err.message + "\nStack:\n" + err.stack);
});

app.listen(port, () => {
  console.log(`\n========================================`);
  console.log(`🛡️  AEGIS AI BACKEND RUNNING ON PORT ${port}`);
  console.log(`========================================`);
  console.log('Menunggu instruksi analisis kode...');
});
