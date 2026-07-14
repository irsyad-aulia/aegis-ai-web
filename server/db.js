const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Memastikan folder server ada (meskipun seharusnya selalu ada)
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[DB] Gagal terkoneksi ke database SQLite:', err.message);
  } else {
    console.log('[DB] Berhasil terkoneksi ke database SQLite.');
    // Inisialisasi tabel users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT,
      provider TEXT DEFAULT 'local',
      provider_id TEXT,
      is_pro INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(username, provider)
    )`, () => {
      db.run("ALTER TABLE users ADD COLUMN is_pro INTEGER DEFAULT 0", (err) => {});
    });

    // Inisialisasi tabel notifications
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Inisialisasi tabel scans (ditambah user_id)
    db.run(`CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      scan_id TEXT NOT NULL,
      repo_name TEXT NOT NULL,
      total_vulnerabilities INTEGER NOT NULL,
      severity_critical INTEGER DEFAULT 0,
      severity_warning INTEGER DEFAULT 0,
      overall_score INTEGER NOT NULL,
      status TEXT NOT NULL,
      raw_data TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('[DB] Gagal membuat tabel:', err.message);
      } else {
        console.log('[DB] Tabel scans siap digunakan.');
      }
    });

    // Inisialisasi tabel integrations
    db.run(`CREATE TABLE IF NOT EXISTS integrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      is_connected INTEGER DEFAULT 0,
      config TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, provider)
    )`);
  }
});

// Fungsi pembantu untuk membungkus perintah db ke dalam Promise (agar bisa di-await)
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery
};
