import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Shield, Zap, Server, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SpotlightCard from '../components/SpotlightCard';

function PricingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: t('pricing.faqs.q1'), a: t('pricing.faqs.a1') },
    { q: t('pricing.faqs.q2'), a: t('pricing.faqs.a2') },
    { q: t('pricing.faqs.q3'), a: t('pricing.faqs.a3') },
    { q: t('pricing.faqs.q4'), a: t('pricing.faqs.a4') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1200px' }}>
      <Helmet>
        <title>Pricing | Aegis AI</title>
        <meta name="description" content="Choose the best Aegis AI plan for your team. From free Starter plans for indie devs to Pro and Enterprise packages for full DevSecOps automation." />
      </Helmet>
      
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3.5rem', marginBottom: '16px', letterSpacing: '-1px' }}
        >
          {t('pricing.title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}
        >
          {t('pricing.subtitle')}
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px', 
          alignItems: 'center' 
        }}
      >
        {/* STARTER CARD */}
        <SpotlightCard 
          variants={itemVariants} 
          whileHover={{ y: -8, scale: 1.02 }}
          className="pricing-card theme-indie" 
          spotlightColor="rgba(14, 165, 233, 0.15)" // cyan spotlight
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.4) 0%, rgba(18, 18, 26, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '32px',
            padding: '40px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
          }}
        >
          <div className="card-glow-overlay"></div>
          <div className="dot-pattern-overlay"></div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Starter</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '24px' }}>
            <span className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>$0</span>
            <span style={{ color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>{t('pricing.month')}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('pricing.cards.starterDesc')}
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="btn btn-secondary btn-flowing-border" 
            style={{ width: '100%', marginBottom: '32px', borderRadius: '16px', padding: '14px', position: 'relative', overflow: 'hidden' }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>{t('pricing.btnStarter')}</span>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.manualScan')} />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.maxFiles')} />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.basicReport')} />
            <FeatureItem icon={<X size={18} color="var(--text-muted)" />} text={t('pricing.features.autoPatch')} muted />
            <FeatureItem icon={<X size={18} color="var(--text-muted)" />} text={t('pricing.features.queuePriority')} muted />
          </div>
        </SpotlightCard>

        {/* PRO CARD (MOST POPULAR) */}
        <SpotlightCard 
          variants={itemVariants} 
          whileHover={{ y: -12, scale: 1.08 }}
          className="pricing-card pro-card" 
          spotlightColor="rgba(124,58,237,0.25)" // brighter purple spotlight
          style={{
            background: 'linear-gradient(135deg, rgba(40, 25, 60, 0.9) 0%, rgba(18, 18, 26, 0.95) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            borderRadius: '32px',
            padding: '44px 40px',
            position: 'relative',
            boxShadow: '0 20px 60px -15px rgba(124, 58, 237, 0.3)',
            transform: 'scale(1.05)',
            zIndex: 10,
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
          }}
        >
          <div className="card-glow-overlay-pro"></div>
          {/* Sleek Floating Pill Badge */}
          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            style={{ 
              position: 'absolute', 
              top: '-16px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, #0ea5e9, #7c3aed, #0ea5e9)', 
              backgroundSize: '200% auto',
              color: '#fff', 
              padding: '6px 20px', 
              borderRadius: '30px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.6)',
            }}
            className="animated-gradient-bg"
          >
            {t('pricing.cards.mostPopular')}
          </motion.div>
          
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <Zap size={22} className="neon-text" /> Pro
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '24px' }}>
            <span className="neon-gradient-text" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1 }}>$24</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '10px', fontWeight: 500 }}>{t('pricing.month')}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('pricing.cards.proDesc')}
          </p>
          <button 
            onClick={() => navigate('/checkout')}
            className="btn btn-primary animate-pulse-glow" 
            style={{ width: '100%', marginBottom: '32px', padding: '16px', fontSize: '1.1rem', borderRadius: '16px', background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-neon))', border: 'none' }}
          >
            {t('pricing.btnPro')}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.unlimitedScan')} highlightColor="#fff" />
            <FeatureItem icon={<Check size={18} color="var(--accent-secondary)" />} text={t('pricing.features.fullAutoPatch')} highlight highlightColor="#fff" />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.zeroDay')} highlightColor="#fff" />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.ide')} highlightColor="#fff" />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.priorityLine')} highlightColor="#fff" />
          </div>
        </SpotlightCard>

        {/* TEAM CARD */}
        <SpotlightCard 
          variants={itemVariants} 
          whileHover={{ y: -8, scale: 1.02 }}
          className="pricing-card theme-enterprise" 
          spotlightColor="rgba(255, 255, 255, 0.1)" // platinum spotlight
          style={{
            background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.4) 0%, rgba(18, 18, 26, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '32px',
            padding: '40px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
          }}
        >
          <div className="card-glow-overlay"></div>
          <div className="mesh-gradient-overlay"></div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <Server size={22} /> Team
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '24px' }}>
            <span className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>$99</span>
            <span style={{ color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>/ user{t('pricing.month')}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('pricing.cards.teamDesc')}
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="btn btn-secondary btn-flowing-border" 
            style={{ width: '100%', marginBottom: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '14px', position: 'relative', overflow: 'hidden' }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>{t('pricing.cards.contactSales')}</span>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.allPro')} />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.teamDashboard')} />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.api')} />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.cicd')} />
            <FeatureItem icon={<Check size={18} color="var(--success)" />} text={t('pricing.features.support')} />
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Feature Comparison Matrix */}
      <div style={{ marginTop: '100px', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px' }}>{t('pricing.compare')}</h2>
        <div style={{ overflowX: 'auto', background: 'rgba(18,18,26,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{t('pricing.thFeatures')}</th>
                <th style={{ padding: '24px', fontSize: '1.2rem' }}>Starter</th>
                <th style={{ padding: '24px', fontSize: '1.2rem', color: 'var(--accent-neon)' }}>Pro</th>
                <th style={{ padding: '24px', fontSize: '1.2rem' }}>Team</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow title={t('pricing.compareRows.row1')} starter="10" pro={t('pricing.compareRows.unlimited')} team={t('pricing.compareRows.unlimited')} />
              <ComparisonRow title={t('pricing.compareRows.row2')} starter="❌" pro="✅" team="✅" />
              <ComparisonRow title={t('pricing.compareRows.row3')} starter="❌" pro="✅" team="✅" />
              <ComparisonRow title={t('pricing.compareRows.row4')} starter="❌" pro="✅" team="✅" />
              <ComparisonRow title={t('pricing.compareRows.row5')} starter="❌" pro="❌" team="✅" />
              <ComparisonRow title={t('pricing.compareRows.row6')} starter="❌" pro="❌" team="✅" />
              <ComparisonRow title={t('pricing.compareRows.row7')} starter="❌" pro="❌" team="✅" />
              <ComparisonRow title={t('pricing.compareRows.row8')} starter={t('pricing.compareRows.community')} pro={t('pricing.compareRows.priority')} team={t('pricing.compareRows.dedicated')} />
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto 80px' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px' }}>{t('pricing.faqTitle')}</h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {faq.q}
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}><ChevronDown /></motion.div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.6 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button onClick={() => navigate('/report')} className="btn btn-secondary" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
          ← {t('nav.dashboard')}
        </button>
      </div>

      <style>{`
        .pricing-card:not(.pro-card):hover {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        .pro-card:hover {
          border-color: #0ea5e9;
          box-shadow: 0 30px 80px -10px rgba(14, 165, 233, 0.4), 0 0 40px rgba(124, 58, 237, 0.3) !important;
        }

        /* Overlay & Themes */
        .card-glow-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 32px;
          background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .pricing-card:hover .card-glow-overlay {
          opacity: 1;
        }

        .card-glow-overlay-pro {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 32px;
          background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
          opacity: 0.5;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .pro-card:hover .card-glow-overlay-pro {
          opacity: 1;
        }

        /* Indie Theme - Polkadot Grid */
        .dot-pattern-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 32px;
          background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
          z-index: 0;
        }
        .theme-indie:hover .dot-pattern-overlay {
          opacity: 1;
        }

        /* Enterprise Theme - Mesh Gradient */
        @keyframes mesh-move {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .mesh-gradient-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 32px;
          background: radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.1) 0px, transparent 50%),
                      radial-gradient(at 100% 100%, rgba(124, 58, 237, 0.1) 0px, transparent 50%);
          background-size: 150% 150%;
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
          z-index: 0;
        }
        .theme-enterprise:hover .mesh-gradient-overlay {
          opacity: 1;
          animation: mesh-move 8s ease infinite;
        }

        /* Animated Flowing Border on Button */
        .btn-flowing-border::before {
          content: "";
          position: absolute;
          top: -50%; left: -50%; right: -50%; bottom: -50%;
          background: conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.8) 80%, transparent 100%);
          animation: rotate-border 4s linear infinite;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .btn-flowing-border::after {
          content: "";
          position: absolute;
          top: 1px; left: 1px; right: 1px; bottom: 1px;
          background: var(--bg-surface);
          border-radius: 15px;
          z-index: 0;
        }
        .btn-flowing-border:hover::before {
          opacity: 1;
        }
        @keyframes rotate-border {
          100% { transform: rotate(360deg); }
        }

        /* Feature Micro-interaction */
        .feature-item-row {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-item-row:hover {
          transform: translateX(8px);
        }
        .feature-item-row:hover .feature-icon-wrapper {
          box-shadow: 0 0 12px rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.1) !important;
        }

        @keyframes bg-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animated-gradient-bg {
          animation: bg-pan 3s linear infinite;
        }
        
        /* Media Query untuk Responsivitas Mobile */
        @media (max-width: 1024px) {
          .pro-card {
            transform: scale(1) !important;
          }
          .pro-card:hover {
            transform: translateY(-8px) !important;
          }
        }
      `}</style>
    </div>
  );
}

function FeatureItem({ icon, text, muted = false, highlight = false, highlightColor = 'var(--text-primary)' }) {
  return (
    <div className="feature-item-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: muted ? 0.4 : 1, position: 'relative', zIndex: 1 }}>
      <div className="feature-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: highlight ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '50%', padding: '4px', transition: 'all 0.3s' }}>
        {icon}
      </div>
      <span style={{ 
        fontSize: '0.95rem', 
        color: highlight ? 'var(--accent-neon)' : muted ? 'var(--text-muted)' : highlightColor,
        fontWeight: highlight ? 600 : 400
      }}>
        {text}
      </span>
    </div>
  );
}

function ComparisonRow({ title, starter, pro, team }) {
  return (
    <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <td style={{ padding: '20px 24px', textAlign: 'left', fontWeight: 500, color: 'var(--text-primary)' }}>{title}</td>
      <td style={{ padding: '20px 24px', color: 'var(--text-secondary)' }}>{starter}</td>
      <td style={{ padding: '20px 24px', color: 'var(--accent-neon)', fontWeight: 600 }}>{pro}</td>
      <td style={{ padding: '20px 24px', color: 'var(--text-primary)' }}>{team}</td>
    </tr>
  );
}

export default PricingPage;
