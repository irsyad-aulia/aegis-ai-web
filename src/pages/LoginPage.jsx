import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SpotlightCard from '../components/SpotlightCard';
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const userParam = params.get('user');
    const errorParam = params.get('error');

    if (tokenParam && userParam) {
      try {
        const userObj = JSON.parse(decodeURIComponent(userParam));
        login(tokenParam, userObj);
        window.location.href = '/dashboard';
      } catch (e) {
        setError('Gagal memproses data login otomatis.');
      }
    } else if (errorParam) {
      setError(`Otentikasi melalui ${errorParam} gagal.`);
    } else if (user) {
      // Redirect ke dashboard jika sudah login dan mengunjungi halaman login
      navigate('/dashboard');
    }
  }, [location, login, navigate, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (err) {
      setError('Koneksi server gagal');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Link 
        to="/" 
        style={{ 
          position: 'absolute', 
          top: '24px', 
          left: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px', 
          color: 'var(--text-secondary)', 
          textDecoration: 'none', 
          fontWeight: 500, 
          zIndex: 10, 
          background: 'rgba(255,255,255,0.03)', 
          padding: '8px 16px', 
          borderRadius: '30px', 
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--accent-neon)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.3)'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <ArrowLeft size={18} />
        <span className="hide-on-mobile" style={{ fontSize: '0.9rem' }}>{t('auth.backHome')}</span>
      </Link>
      <SpotlightCard style={{ width: '450px', padding: '40px', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Shield color="var(--accent-neon)" size={48} />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{t('login.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('login.subtitle')}</p>
        
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{t('login.email')}</label>
            <input 
              type="text" 
              placeholder="john@acme.com" 
              className="input-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{t('login.password')}</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginTop: '-4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--accent-neon)', cursor: 'pointer' }} /> {t('login.remember')}
            </label>
            <Link to="#" style={{ color: 'var(--accent-neon)', textDecoration: 'none' }}>{t('login.forgot')}</Link>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', padding: '14px', fontSize: '1.05rem' }}>{t('login.btn')}</button>
        </form>

        <div style={{ margin: '24px 0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border-color)', zIndex: 0 }}></div>
          <span style={{ position: 'relative', background: '#06060c', padding: '0 12px', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 1 }}>{t('auth.or')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '12px' }}
            onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M24 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.82a5.75 5.75 0 0 1-2.5 3.77v3.13h4.02c2.35-2.17 3.68-5.38 3.68-9.14z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.96-2.91l-4.02-3.13c-1.08.72-2.46 1.15-3.94 1.15-3.03 0-5.61-2.05-6.53-4.81H1.32v3.25A11.96 11.96 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.47 14.3a7.17 7.17 0 0 1 0-4.59V6.45H1.32a11.98 11.98 0 0 0 0 11.1l4.15-3.25z"/><path fill="#4285F4" d="M12 4.88c1.76 0 3.34.6 4.59 1.79l3.43-3.43C17.96 1.25 15.24 0 12 0 7.42 0 3.38 2.65 1.32 6.45l4.15 3.25c.92-2.76 3.5-4.82 6.53-4.82z"/></svg>
            {t('auth.google')}
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '12px' }}
            onClick={() => window.location.href = 'http://localhost:3000/api/auth/github'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            {t('auth.github')}
          </button>
        </div>

        <div style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>
          {t('login.noAccount')} <Link to="/register" style={{ color: 'var(--accent-neon)' }}>{t('login.register')}</Link>
        </div>
      </SpotlightCard>
    </div>
  );
}

export default LoginPage;
