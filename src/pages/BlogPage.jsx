import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import { useTranslation } from 'react-i18next';

function BlogPage() {
  const { t } = useTranslation();
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid var(--border-hover)', color: 'var(--accent-neon)', marginBottom: '24px', fontWeight: 600 }}>
            <BookOpen size={16} /> {t('blog.subtitle')}
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '24px', letterSpacing: '-1px' }}>
            {t('blog.title')}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
            Dapatkan wawasan terbaru mengenai tren DevSecOps, analisis kerentanan zero-day, dan pembaruan platform Aegis AI langsung dari tim riset kami.
          </p>
        </motion.div>
      </section>

      {/* Articles Grid */}
      <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px', marginBottom: '60px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Link to="#" key={i} style={{ textDecoration: 'none', display: 'block' }}>
            <SpotlightCard style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ height: '200px', borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <img src="/blog-thumb.png" alt="Thumbnail Artikel" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--accent-neon)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Riset Keamanan</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', lineHeight: 1.4, color: 'var(--text-primary)' }}>Cara Melindungi Pipeline CI/CD dari Serangan Supply Chain</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', flex: 1 }}>Pelajari teknik tingkat lanjut untuk mendeteksi dependensi berbahaya sebelum mereka disuntikkan ke dalam artefak build Anda.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>7 Juli 2026</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-neon)' }}>{t('blog.readMore')} <ArrowRight size={14} /></span>
                </div>
              </div>
            </SpotlightCard>
          </Link>
        ))}
      </section>
      
      <div style={{ textAlign: 'center' }}>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> {t('auth.backHome')}
        </Link>
      </div>
    </div>
  );
}

export default BlogPage;
