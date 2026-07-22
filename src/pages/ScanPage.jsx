import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Folder, FileArchive, Shield, Scan, Globe, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../config';


function ScanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, user, upgradeToPro, logout } = useAuth();
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('quota');
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [githubUrl, setGithubUrl] = useState('');
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const resStats = await fetch(`${API_URL}/api/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resStats.ok) {
          const data = await resStats.json();
          setRecentScans(data.repos || []);
        }
        
        const resQuota = await fetch(`${API_URL}/api/user/quota`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resQuota.ok) {
          const quotaData = await resQuota.json();
          setQuotaInfo(quotaData);
        }
      } catch (e) {
        console.error("Gagal mengambil data:", e);
      }
    };
    fetchData();
  }, [token, isScanning]); // Refresh when scan finishes!

  const handleViewReport = async (scanId) => {
    if (!token) return;
    try {
      const toastId = toast.loading('Mengambil laporan...');
      const res = await fetch(`${API_URL}/api/scan/${scanId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.dismiss(toastId);
      if (res.ok) {
        const reportData = await res.json();
        navigate('/report', { state: { reportData } });
      } else {
        toast.error('Gagal mengambil detail laporan.');
      }
    } catch (e) {
      toast.error('Gagal menghubungi server.');
    }
  };

  const dummyReport1 = {
    scanId: "SCN-FRONTEND-92",
    fileName: "frontend-app-core",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    overallScore: 92,
    status: 'secure',
    vulnerabilitiesFound: 1,
    aiSummary: "Aplikasi frontend secara keseluruhan sangat aman. Hanya ditemukan satu masalah minor terkait konfigurasi header keamanan.",
    vulnerabilities: [{
      id: "VULN-001", type: "Missing Security Header", severity: "low", fileName: "index.html", line: 12,
      description: "Header X-Frame-Options tidak ditemukan.", codeSnippet: "<head>\n  <title>App</title>\n</head>", recommendation: "Tambahkan X-Frame-Options: DENY", fixedCode: "<head>\n  <meta http-equiv=\"X-Frame-Options\" content=\"DENY\">\n  <title>App</title>\n</head>"
    }]
  };

  const dummyReport2 = {
    scanId: "SCN-BACKEND-64",
    fileName: "backend-auth-service",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    overallScore: 64,
    status: 'warning',
    vulnerabilitiesFound: 3,
    aiSummary: "Ditemukan beberapa kerentanan serius pada modul autentikasi backend. Segera perbaiki celah injeksi SQL.",
    vulnerabilities: [{
      id: "VULN-002", type: "SQL Injection", severity: "critical", fileName: "auth.js", line: 45,
      description: "Input pengguna digabungkan langsung ke dalam kueri SQL.", codeSnippet: "const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;", recommendation: "Gunakan parameterized queries.", fixedCode: "const query = 'SELECT * FROM users WHERE email = ?';\ndb.execute(query, [req.body.email]);"
    }]
  };

  // Efek untuk mengganti teks saat proses analisis (progress == 100)
  useEffect(() => {
    let interval;
    const scanPhrases = t('scan.phrases', { returnObjects: true });
    
    if (isScanning && scanPhrases && scanPhrases.length > 0) {
      interval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % scanPhrases.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isScanning, uploadProgress]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleFilesSelected = (files) => {
    if (!files || files.length === 0) return;

    if (user?.isGuest) {
      toast.error('Pemindaian tidak tersedia di Mode Demo. Silakan daftar untuk menggunakan fitur ini.', { duration: 4000 });
      return;
    }

    // BLOKIR KERAS (HARD BLOCK) UNTUK MENCEGAH BROWSER FREEZE
    // Browser akan mati/lag jika mencoba memproses FileList dengan puluhan ribu item (misal: node_modules).
    if (files.length > 3000) {
      toast.error(
        `Mendeteksi ${files.length.toLocaleString()} file! Memproses folder sebesar ini akan membekukan (lag) peramban Anda. Harap kompres menjadi .zip terlebih dahulu.`, 
        { duration: 8000 }
      );
      return;
    }
    // Pengecekan jika file adalah ZIP, pastikan ukurannya wajar (Misal: maksimal 10MB untuk demo)
    if (files.length === 1 && files[0].name.endsWith('.zip')) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (files[0].size > maxSize) {
        toast.error(`Ukuran file ZIP terlalu besar (${(files[0].size / 1024 / 1024).toFixed(1)}MB). Batas maksimal adalah 10MB untuk menjaga stabilitas server demo.`, { duration: 6000 });
        return;
      }
    }
    // LANGSUNG tampilkan UI Loading agar tidak ada kesan "Lag/Ngelek"
    setIsScanning(true);
    setUploadProgress(0);
    setStatusText(t('scan.sysInit', '[SYS_INIT] Mengalokasikan memori pemindai...'));

    // Gunakan requestAnimationFrame ganda untuk memastikan UI benar-benar sudah di-render
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        const junkPatterns = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.vscode', '.idea'];
        let filteredFiles = [];
        
        // Memecah pemrosesan file menjadi potongan kecil (Chunking) agar thread tidak terblokir
        const chunkSize = 2000;
        for (let i = 0; i < files.length; i += chunkSize) {
          setStatusText(`${t('scan.sysInitScan', '[SYS_INIT] Memindai direktori...')} (${Math.min(i + chunkSize, files.length)} / ${files.length})`);
          
          const end = Math.min(i + chunkSize, files.length);
          for (let j = i; j < end; j++) {
            const file = files[j];
            const path = file.webkitRelativePath || file.name;
            const isJunk = junkPatterns.some(pattern => path.includes(`/${pattern}/`) || path.startsWith(`${pattern}/`));
            if (!isJunk) {
              filteredFiles.push(file);
            }
          }
          // Melepaskan thread ke browser agar UI bisa merender progress
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (filteredFiles.length === 0) {
          toast.error('Tidak ada file valid yang ditemukan (semua terfilter).');
          setIsScanning(false);
          return;
        }

        if (filteredFiles.length > 2000) {
          toast.error('Terlalu banyak file! Harap kompres menjadi .zip terlebih dahulu.');
          setIsScanning(false);
          return;
        }
        
        setStatusText(t('scan.netTxSetup', '[NET_TX] Menyiapkan Transmisi Jaringan...'));
        
        const formData = new FormData();
        
        // Chunking untuk formData append (ini juga memakan CPU tinggi jika ribuan file)
        for (let i = 0; i < filteredFiles.length; i += chunkSize) {
          const end = Math.min(i + chunkSize, filteredFiles.length);
          for (let j = i; j < end; j++) {
            formData.append('codeFiles', filteredFiles[j]);
          }
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        // Simulasi progress bar untuk Localhost (karena localhost terlalu cepat)
        let simulatedProgress = 0;
        const simInterval = setInterval(async () => {
          if (simulatedProgress < 90) {
            simulatedProgress += Math.floor(Math.random() * 15) + 5;
            if (simulatedProgress > 90) simulatedProgress = 90;
            setUploadProgress(simulatedProgress);
            setStatusText(`${t('scan.netTxUpload', '[NET_TX] Mengunggah Data...')} ${simulatedProgress}%`);
          } else {
            clearInterval(simInterval);
            setUploadProgress(100);
            
            try {
              const res = await fetch(`${API_URL}/api/scan`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
              });
              
              setIsScanning(false);
              if (res.ok) {
                const data = await res.json();
                toast.success('Analisis Selesai!');
                localStorage.setItem('aegisLastScan', JSON.stringify(data));
                navigate('/report', { state: { reportData: data } });
              } else {
                let errData;
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                  errData = await res.json();
                } else {
                  // Jika server merespons dengan halaman error HTML (seperti 413 Payload Too Large atau 504 Gateway Timeout)
                  errData = { error: `Server error: ${res.status} ${res.statusText}. Mungkin file Anda terlalu besar atau server mengalami timeout.` };
                }
                
                if (errData.error === 'QUOTA_EXCEEDED') {
                  setUpgradeReason('quota');
                  setShowUpgradeModal(true);
                } else {
                  toast.error(errData.error || 'Server menolak unggahan Anda.', { duration: 6000 });
                }
              }
            } catch (e) {
              setIsScanning(false);
              toast.error(e.message || 'Gagal menghubungi Server Aegis Core. Periksa koneksi atau ukuran file Anda.', { duration: 6000 });
            }
          }
        }, 150);

      });
    });
  };

  const handleGithubScan = async () => {
    if (user?.isGuest) {
      toast.error('Pemindaian tidak tersedia di Mode Demo. Silakan daftar untuk menggunakan fitur ini.', { duration: 4000 });
      return;
    }
    
    if (!githubUrl || !githubUrl.includes('github.com')) {
      toast.error('URL GitHub tidak valid!');
      return;
    }
    
    setIsScanning(true);
    setUploadProgress(10);
    setStatusText('[NET_TX] Menghubungi GitHub API...');

    try {
      // Simulasi progress unduhan dari github
      let simulatedProgress = 10;
      const simInterval = setInterval(() => {
        if (simulatedProgress < 90) {
          simulatedProgress += Math.floor(Math.random() * 15) + 5;
          if (simulatedProgress > 90) simulatedProgress = 90;
          setUploadProgress(simulatedProgress);
          setStatusText(`[NET_TX] Mengunduh Repository... ${simulatedProgress}%`);
        } else {
          clearInterval(simInterval);
        }
      }, 300);

      const res = await fetch(`${API_URL}/api/scan-github`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ repoUrl: githubUrl }),
      });

      clearInterval(simInterval);
      setUploadProgress(100);
      setIsScanning(false);
      
      if (res.ok) {
        const data = await res.json();
        toast.success('Analisis Selesai!');
        localStorage.setItem('aegisLastScan', JSON.stringify(data));
        navigate('/report', { state: { reportData: data } });
      } else {
        const errData = await res.json();
        if (errData.error === 'QUOTA_EXCEEDED') {
          setUpgradeReason('quota');
          setShowUpgradeModal(true);
        } else {
          toast.error(errData.error || 'Server menolak permintaan GitHub Anda.', { duration: 6000 });
        }
      }
    } catch (e) {
      setIsScanning(false);
      toast.error('Gagal menghubungi Server Aegis Core.');
    }
  };

  return (
    <motion.div 
      className="container" 
      style={{ padding: '40px 24px', maxWidth: '800px' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Helmet>
        <title>Code Scanner | Aegis AI</title>
        <meta name="description" content="Scan your repository or local code directory instantly. Aegis AI detects SQL injections, XSS, and hardcoded secrets within seconds." />
        <meta property="og:title" content="Code Scanner | Aegis AI" />
        <meta property="og:description" content="Scan your repository or local code directory instantly. Aegis AI detects SQL injections, XSS, and hardcoded secrets within seconds." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Code Scanner | Aegis AI" />
        <meta name="twitter:description" content="Scan your repository or local code directory instantly." />
      </Helmet>

      {user?.isGuest && (
        <div style={{ background: 'rgba(239, 160, 11, 0.1)', border: '1px solid var(--warning)', color: 'var(--warning)', padding: '16px', borderRadius: '12px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <strong>{t('scan.demoModeTitle', 'Mode Demo:')}</strong> {t('scan.demoModeDesc', 'Fitur pemindaian (scan) dinonaktifkan dalam mode ini.')}
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            {t('dashboard.btnRegisterNow', 'Daftar Sekarang')}
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{t('scan.title')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
          {t('scan.subtitle')}
        </p>

        {quotaInfo && !quotaInfo.isPro && (
          <div style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '24px', color: 'var(--warning)', fontSize: '0.95rem', marginBottom: '32px' }}>
            {t('scan.quota')} <strong>{Math.max(0, quotaInfo.max - quotaInfo.used)} / {quotaInfo.max}</strong> {t('scan.left')} <span style={{ color: 'var(--accent-neon)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowUpgradeModal(true)}>{t('dashboard.upgradePro')}</span> {t('scan.unlimited')}
          </div>
        )}

        {/* GitHub Integration Input */}
        {!isScanning && (
          <div style={{ maxWidth: '600px', margin: '0 auto 40px', background: 'rgba(18, 18, 26, 0.6)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#0d0d12', borderRadius: '8px', padding: '0 16px', flex: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Globe size={20} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
              <input 
                type="text" 
                aria-label="GitHub Repository URL"
                placeholder="https://github.com/facebook/react" 
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '1rem', padding: '12px 0' }}
              />
            </div>
            <button className="btn btn-primary" onClick={handleGithubScan}>
              {t('scan.scanRepo')}
            </button>
          </div>
        )}
        
        {!isScanning && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <button 
              onClick={() => {
                if (quotaInfo && quotaInfo.isPro) {
                  toast.success('Fitur Auto-Scan harian berhasil diaktifkan untuk repository ini!');
                } else {
                  setUpgradeReason('autoscan');
                  setShowUpgradeModal(true);
                }
              }}
              style={{ background: 'transparent', border: '1px solid rgba(124, 58, 237, 0.4)', color: 'var(--accent-neon)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Clock size={16} /> {t('scan.autoScan')}
            </button>
          </div>
        )}
      </div>

      <motion.div 
        className="glass-panel"
        style={{ 
          padding: '60px 24px', 
          textAlign: 'center',
          border: isDragging ? '2px dashed var(--accent-neon)' : '2px dashed var(--border-color)',
          background: isDragging ? 'rgba(124, 58, 237, 0.05)' : 'rgba(18, 18, 26, 0.6)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isScanning ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '40px 20px' }}>
            
            {/* Animasi Cyberpunk Scanner */}
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="radar-circle" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(124, 58, 237, 0.2)' }}></div>
              <div className="radar-circle" style={{ position: 'absolute', width: '70%', height: '70%', borderRadius: '50%', border: '2px solid rgba(124, 58, 237, 0.4)' }}></div>
              
              {uploadProgress === 100 ? (
                <Shield size={50} color="var(--accent-neon)" className="pulse-glow" />
              ) : (
                <Scan size={50} color="var(--accent-neon)" />
              )}
              
              <div className="scanner-line" style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', 
                background: 'var(--accent-neon)', boxShadow: '0 0 10px var(--accent-neon)',
                animation: 'scan-vertical 2s linear infinite'
              }}></div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', height: '8px' }}>
              <div style={{ 
                height: '100%', 
                width: `${uploadProgress}%`, 
                background: 'var(--accent-neon)', 
                transition: 'width 0.3s ease-out',
                boxShadow: '0 0 15px var(--accent-neon)' 
              }} />
            </div>

            {/* Dynamic Status Text */}
            <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {uploadProgress < 100 ? (
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'monospace' }}>
                  {statusText}
                </h3>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.h3 
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{ fontSize: '1.1rem', color: 'var(--accent-neon)', margin: 0, fontFamily: 'monospace', letterSpacing: '0.5px' }}
                  >
                    {t('scan.phrases', { returnObjects: true })[phraseIndex] || ''}
                  </motion.h3>
                </AnimatePresence>
              )}
            </div>
          </div>
        ) : (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <UploadCloud size={40} color="var(--accent-neon)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{t('scan.dropTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('scan.dropDesc')}</p>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-primary">
                    <FileArchive size={20} />
                    Archive (.zip)
                  </button>
                  <input 
                    type="file" 
                    accept=".zip,.tar,.gz"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-neon)', marginTop: '8px', fontWeight: 'bold' }}>
                  (Disarankan)
                </span>
              </div>
              <span style={{ color: 'var(--text-muted)', marginTop: '10px' }}>{t('scan.or')}</span>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-secondary">
                    <Folder size={20} />
                    {t('scan.btnFolder')}
                  </button>
                  <input 
                    type="file" 
                    webkitdirectory="true" 
                    directory="true"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 500 }}>
                  (Maks. 3000 File)
                </span>
              </div>
              <span style={{ color: 'var(--text-muted)', marginTop: '10px' }}>{t('scan.or')}</span>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-secondary">
                    <UploadCloud size={20} />
                    Single File
                  </button>
                  <input 
                    type="file" 
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Riwayat Pemindaian Terakhir (Recent Scans Panel) */}
      {!isScanning && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginTop: '40px', background: 'rgba(18, 18, 26, 0.4)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Clock size={20} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{t('scan.history')}</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentScans.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                {t('scan.noHistory')}
              </p>
            ) : (
              recentScans.slice(0, 5).map((scan) => (
                <div key={scan.scanId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{scan.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {scan.timeAgoStr} &bull; {scan.issues} {t('scan.vulnFound')}
                    </p>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }} 
                    onClick={() => handleViewReport(scan.scanId)}
                  >
                    {t('scan.viewReport')} <ArrowRight size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes scan-vertical {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .pulse-glow {
          animation: pulse-glow 2s infinite alternate;
        }
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 5px var(--accent-neon)); }
          100% { filter: drop-shadow(0 0 20px var(--accent-neon)); }
        }
      `}</style>
      
      {/* Modal Upgrade */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', position: 'relative' }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Shield size={32} color="var(--accent-neon)" />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
                {upgradeReason === 'quota' ? t('scan.quotaExceeded') : t('scan.premiumAutoScan')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: 1.6 }}>
                {upgradeReason === 'quota' ? t('scan.quotaMsg') : t('scan.autoScanMsg')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px' }}
                  onClick={async () => {
                    const toastId = toast.loading('Memproses simulasi pembayaran...');
                    const success = await upgradeToPro();
                    if (success) {
                      toast.success('Berhasil! Akun Anda sekarang adalah Pro.', { id: toastId });
                      setQuotaInfo(prev => ({ ...prev, isPro: true }));
                      setShowUpgradeModal(false);
                    } else {
                      toast.error('Gagal memproses upgrade.', { id: toastId });
                    }
                  }}
                >
                  {t('scan.simulate')}
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '14px', background: 'transparent' }}
                  onClick={() => setShowUpgradeModal(false)}
                >
                  {t('scan.cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ScanPage;
