import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Target, Users, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import { useTranslation } from 'react-i18next';

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid var(--border-hover)', color: 'var(--accent-neon)', marginBottom: '24px', fontWeight: 600 }}>
            <Shield size={16} /> {t('about.subtitle')}
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '24px', letterSpacing: '-1px' }}>
            {t('about.title')}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.8 }}>
            {t('about.content')}
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '80px' }}>
        <SpotlightCard style={{ padding: '32px' }}>
          <Target color="var(--accent-neon)" size={32} style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Presisi Tanpa Kompromi</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Model AI kami dilatih dengan jutaan repositori open-source untuk mengurangi false-positive hingga 99%, memberikan Anda peringatan keamanan yang benar-benar akurat dan dapat ditindaklanjuti.</p>
        </SpotlightCard>
        <SpotlightCard style={{ padding: '32px' }}>
          <Zap color="var(--accent-neon)" size={32} style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Kecepatan Skala Enterprise</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Pemindaian ribuan file hanya memakan waktu dalam hitungan detik. Integrasi pipeline CI/CD kami tidak akan memperlambat proses rilis tim developer (Agile) Anda sama sekali.</p>
        </SpotlightCard>
        <SpotlightCard style={{ padding: '32px' }}>
          <Users color="var(--accent-neon)" size={32} style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Didesain untuk Developer</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Keamanan adalah tanggung jawab bersama. Antarmuka kami dirancang agar mudah dimengerti oleh developer, bukan sekadar memberikan log error kompleks kepada tim sekuriti.</p>
        </SpotlightCard>
      </section>

      {/* CTA */}
      <section className="container" style={{ textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '60px 40px', borderRadius: '24px', background: 'rgba(124, 58, 237, 0.05)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Bergabunglah dengan Revolusi Keamanan</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>Ribuan engineer inovatif telah memercayakan repositori berharga mereka kepada Aegis AI.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px' }}>{t('pricing.btnStarter')}</Link>
            <Link to="/" className="btn btn-secondary" style={{ padding: '14px 32px', display: 'flex', gap: '8px', alignItems: 'center' }}><ArrowLeft size={16} /> {t('auth.backHome')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
