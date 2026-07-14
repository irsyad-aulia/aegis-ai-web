import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import { useTranslation } from 'react-i18next';

function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '80px', paddingBottom: '40px' }}>
      <SpotlightCard style={{ width: '500px', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Mail color="var(--accent-neon)" size={48} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>{t('contact.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
          {t('contact.subtitle')}
        </p>

        {sent ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '8px' }}>{t('contact.successTitle')}</h3>
            <p style={{ fontSize: '0.9rem' }}>{t('contact.successDesc')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{t('contact.name')}</label>
              <input type="text" placeholder="John Doe" className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{t('contact.email')}</label>
              <input type="email" placeholder="john@acme.com" className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{t('contact.message')}</label>
              <textarea placeholder="..." className="input-field" style={{ minHeight: '120px', resize: 'vertical' }} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {t('contact.send')} <Send size={16} />
            </button>
          </form>
        )}

        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> {t('auth.backHome')}
        </Link>
      </SpotlightCard>
    </div>
  );
}

export default ContactPage;
