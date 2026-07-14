import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, Home, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'es', label: '🇪🇸 ES' },
    { code: 'id', label: '🇮🇩 ID' },
    { code: 'ja', label: '🇯🇵 JA' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    if (!token) return;
    
    const fetchNotifs = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const fetchQuota = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/user/quota', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setQuotaInfo(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotifs();
    fetchQuota();
    const interval = setInterval(() => {
      fetchNotifs();
      fetchQuota();
    }, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleReadNotifs = async () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu && unreadCount > 0) {
      try {
        await fetch('http://localhost:3000/api/notifications/read', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(6, 6, 12, 0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* LEFT: LOGO */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <Shield color="var(--accent-neon)" size={28} />
            </motion.div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>Aegis<span className="neon-text">AI</span></span>
          </Link>
        </div>

        {/* CENTER: NAVIGATION LINKS (DESKTOP) */}
        {user && (
          <div className="desktop-nav-links" style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '36px', fontSize: '0.95rem' }}>
            <Link to="/scan" className="nav-link">{t('nav.scan')}</Link>
            <Link to="/integrations" className="nav-link">{t('nav.integrations')}</Link>
            <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {t('nav.dashboard')} {!user.isPro && <span className="pro-badge-mini">PRO</span>}
            </Link>
          </div>
        )}

        {/* RIGHT: ACTIONS & PROFILE */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '20px', alignItems: 'center' }}>
          
          {/* Upgrade Pro Button (For Free Users) */}
          {user && !user.isPro && (
            <Link to="/pricing" className="hide-on-mobile" style={{ 
              textDecoration: 'none', 
              background: 'linear-gradient(90deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.15) 100%)',
              border: '1px solid rgba(124,58,237,0.5)',
              color: 'var(--accent-neon)',
              padding: '6px 16px',
              borderRadius: '24px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(124,58,237,0.3) 0%, rgba(59,130,246,0.3) 100%)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(124,58,237,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.15) 100%)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <Shield size={14} fill="var(--accent-neon)" /> {t('nav.upgrade')}
            </Link>
          )}
          
          {/* Language Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              {currentLang.code.toUpperCase()} <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#12121a', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', minWidth: '120px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                >
                  {languages.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setIsLangOpen(false); }}
                      style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', color: 'var(--text-primary)', background: 'transparent', cursor: 'pointer', border: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
              
              {/* Notifikasi Lonceng */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={handleReadNotifs}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', padding: 0 }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px',
                      background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 5px var(--danger)'
                    }}></span>
                  )}
                </button>

                {/* Dropdown Notifikasi */}
                {showNotifMenu && (
                  <div style={{
                    position: 'absolute', top: '40px', right: '-20px', width: '320px',
                    background: '#12121a', border: '1px solid var(--border-color)', borderRadius: '12px',
                    padding: '16px', zIndex: 100, boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                    maxHeight: '350px', overflowY: 'auto'
                  }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>Notifications</h4>
                    {notifications.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>All caught up!</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ 
                          padding: '12px', marginBottom: '8px', borderRadius: '8px',
                          background: n.is_read ? 'transparent' : 'rgba(239, 68, 68, 0.05)',
                          borderLeft: n.is_read ? '2px solid transparent' : '2px solid var(--danger)'
                        }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: n.is_read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.5 }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Quota Badge */}
              {quotaInfo && !quotaInfo.isPro && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 12px', borderRadius: '20px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  {Math.max(0, quotaInfo.max - quotaInfo.used)} Left
                </div>
              )}

              {/* Minimalist User Avatar */}
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, var(--accent-neon), #3b82f6)', 
                  color: '#fff', 
                  width: '36px', height: '36px', 
                  borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: '700', fontSize: '1rem',
                  boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)',
                  cursor: 'pointer',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}
                onClick={handleLogout}
                title={`Logged in as ${user.username} (Click to Logout)`}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>{t('nav.login')}</Link>
          )}
          
          {/* Hamburger Menu Toggle (Mobile Only) */}
          {user && (
            <button 
              className="mobile-menu-btn"
              style={{ color: 'var(--text-primary)', marginLeft: '10px' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ background: '#12121a', overflow: 'hidden', borderBottom: '1px solid var(--border-color)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', gap: '16px' }}>
              <Link to="/scan" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.scan')}</Link>
              <Link to="/integrations" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.integrations')}</Link>
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.dashboard')}</Link>
              {!user.isPro && (
                <Link to="/pricing" className="nav-link" style={{ color: 'var(--accent-neon)' }} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.upgrade')} to PRO</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .nav-link.highlight {
          color: var(--accent-neon);
          font-weight: 600;
        }
        .pro-badge-mini {
          font-size: 0.6rem;
          background: rgba(255,255,255,0.1);
          color: var(--text-secondary);
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: bold;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
