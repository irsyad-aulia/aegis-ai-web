require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-aegis-key';

// Konfigurasi Passport Google
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : profile.id;
      const username = profile.displayName || email.split('@')[0];
      
      let user = await db.getQuery('SELECT * FROM users WHERE provider = ? AND provider_id = ?', ['google', profile.id]);
      if (!user) {
        const result = await db.runQuery('INSERT INTO users (username, provider, provider_id, is_pro) VALUES (?, ?, ?, 0) RETURNING id', [username, 'google', profile.id]);
        user = { id: result.lastID, username, provider: 'google', is_pro: 0 };
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

// Konfigurasi Passport GitHub
if (process.env.GITHUB_CLIENT_ID) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const username = profile.username || profile.displayName || profile.id;
      let user = await db.getQuery('SELECT * FROM users WHERE provider = ? AND provider_id = ?', ['github', profile.id]);
      if (!user) {
        const result = await db.runQuery('INSERT INTO users (username, provider, provider_id, is_pro) VALUES (?, ?, ?, 0) RETURNING id', [username, 'github', profile.id]);
        user = { id: result.lastID, username, provider: 'github', is_pro: 0 };
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Rute Otentikasi Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google` }), (req, res) => {
  const isPro = req.user.is_pro === 1;
  const token = jwt.sign({ id: req.user.id, username: req.user.username, isPro }, JWT_SECRET, { expiresIn: '7d' });
  const userData = encodeURIComponent(JSON.stringify({ id: req.user.id, username: req.user.username, isPro }));
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&user=${userData}`);
});

// Rute Otentikasi GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=github` }), (req, res) => {
  const isPro = req.user.is_pro === 1;
  const token = jwt.sign({ id: req.user.id, username: req.user.username, isPro }, JWT_SECRET, { expiresIn: '7d' });
  const userData = encodeURIComponent(JSON.stringify({ id: req.user.id, username: req.user.username, isPro }));
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&user=${userData}`);
});


// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    // Cek apakah username sudah ada untuk provider local
    const existing = await db.getQuery('SELECT * FROM users WHERE username = ? AND provider = ?', [username, 'local']);
    if (existing) {
      return res.status(400).json({ error: 'Username sudah terpakai' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan
    const result = await db.runQuery('INSERT INTO users (username, password) VALUES (?, ?) RETURNING id', [username, hashedPassword]);
    
    // Auto-login (generate token)
    const token = jwt.sign({ id: result.lastID, username, isPro: false }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: result.lastID, username, isPro: false } });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.getQuery('SELECT * FROM users WHERE username = ? AND provider = ?', [username, 'local']);
    
    if (!user) {
      return res.status(400).json({ error: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Username atau password salah' });
    }

    const isPro = user.is_pro === 1;
    const token = jwt.sign({ id: user.id, username: user.username, isPro }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, isPro } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
});

// Middleware untuk melindungi Endpoint
const verifyToken = (req, res, next) => {
  // Ambil token dari header "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

module.exports = {
  router,
  verifyToken
};
