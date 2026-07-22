const { Pool } = require('pg');
require('dotenv').config();

// Koneksi ke PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aegis',
  // Di produksi (Render), SSL biasanya diperlukan
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('[DB] Gagal terkoneksi ke database PostgreSQL:', err.message);
  } else {
    console.log('[DB] Berhasil terkoneksi ke database PostgreSQL.');
    release();

    // Inisialisasi tabel users
    pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255),
      provider VARCHAR(50) DEFAULT 'local',
      provider_id VARCHAR(255),
      is_pro INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(username, provider)
    )`).catch(err => console.error('[DB] Gagal membuat tabel users:', err.message));

    // Inisialisasi tabel notifications
    pool.query(`CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`).catch(err => console.error('[DB] Gagal membuat tabel notifications:', err.message));

    // Inisialisasi tabel scans
    pool.query(`CREATE TABLE IF NOT EXISTS scans (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      scan_id VARCHAR(255) NOT NULL,
      repo_name VARCHAR(255) NOT NULL,
      total_vulnerabilities INTEGER NOT NULL,
      severity_critical INTEGER DEFAULT 0,
      severity_warning INTEGER DEFAULT 0,
      overall_score INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL,
      raw_data TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`).then(() => {
      console.log('[DB] Tabel scans siap digunakan.');
    }).catch(err => console.error('[DB] Gagal membuat tabel scans:', err.message));

    // Inisialisasi tabel integrations
    pool.query(`CREATE TABLE IF NOT EXISTS integrations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      provider VARCHAR(50) NOT NULL,
      is_connected INTEGER DEFAULT 0,
      config TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, provider)
    )`).catch(err => console.error('[DB] Gagal membuat tabel integrations:', err.message));
  }
});

// Helper function to convert SQLite '?' parameters to PostgreSQL '$1, $2' parameters
function convertSql(sql) {
  let count = 1;
  return sql.replace(/\?/g, () => `$${count++}`);
}

// Fungsi pembantu untuk membungkus perintah pool ke dalam Promise dengan API seperti sqlite3
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(convertSql(sql), params, (err, result) => {
      if (err) reject(err);
      else resolve(result && result.rows && result.rows[0] ? { lastID: result.rows[0].id } : { lastID: null });
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(convertSql(sql), params, (err, result) => {
      if (err) reject(err);
      else resolve(result ? result.rows[0] : null);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(convertSql(sql), params, (err, result) => {
      if (err) reject(err);
      else resolve(result ? result.rows : []);
    });
  });
};

module.exports = {
  db: pool,
  runQuery,
  getQuery,
  allQuery
};
