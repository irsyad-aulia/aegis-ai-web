import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Code2, GitMerge, Lock, Zap, CheckCircle2, Shield, ChevronDown, GitBranch as GithubIcon, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import SpotlightCard from '../components/SpotlightCard';
import MagneticElement from '../components/MagneticElement';

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loginAsGuest } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: t('landing.faq.q1', 'How does Aegis AI work?'), a: t('landing.faq.a1', 'Aegis AI acts as a GitHub App that listens to webhooks from your repositories. Whenever a new Pull Request is opened, it scans the code changes using advanced static analysis and AI to find vulnerabilities.') },
    { q: t('landing.faq.q2', 'Is my source code secure?'), a: t('landing.faq.a2', 'Absolutely. We do not store your source code. Our analysis is performed in memory and the code is immediately discarded after the review is generated.') },
    { q: t('landing.faq.q3', 'Which programming languages are supported?'), a: t('landing.faq.a3', 'We support over 20+ major programming languages including Python, JavaScript, TypeScript, Go, Java, and C++.') },
  ];

  return (
    <div style={{ paddingBottom: '0', position: 'relative' }}>
      <Helmet>
        <title>Aegis AI - Automated Code Security & Vulnerability Scanner</title>
        <meta name="description" content="Aegis AI is an advanced GitHub App that uses AI and static analysis to find and fix vulnerabilities in your code instantly. Secure your codebase today." />
        <meta name="keywords" content="AI Code Security, Vulnerability Scanner, GitHub Security, AppSec" />
        
        {/* Open Graph Tags for Social Media (WhatsApp, Facebook, LinkedIn) */}
        <meta property="og:title" content="Aegis AI - Automated Code Security & Vulnerability Scanner" />
        <meta property="og:description" content="Aegis AI is an advanced GitHub App that uses AI and static analysis to find and fix vulnerabilities in your code instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aegis-ai.com" />
        <meta property="og:image" content="https://aegis-ai.com/og-image.jpg" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aegis AI - Code Security Scanner" />
        <meta name="twitter:description" content="Instantly find and fix vulnerabilities in your code with AI-powered static analysis." />
        <meta name="twitter:image" content="https://aegis-ai.com/og-image.jpg" />
      </Helmet>
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', paddingTop: '120px', paddingBottom: '80px', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid var(--border-hover)', color: 'var(--accent-neon)', marginBottom: '24px', fontWeight: 600, fontSize: '0.9rem' }}>
            <Zap size={14} style={{ display: 'inline', marginRight: '6px' }} />
            {t('landing.badge')}
          </div>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '24px', letterSpacing: '-1px' }}>
            {t('landing.title1')} <br /> <span className="neon-gradient-text">{t('landing.titleHighlight')}</span>{t('landing.title2')}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.8 }}>
            {t('landing.desc')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <MagneticElement magneticPull={0.4}>
              <Link to="/scan" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'inline-block' }}>{t('landing.btnStart')}</Link>
            </MagneticElement>
            <MagneticElement magneticPull={0.4}>
              <button 
                onClick={() => {
                  if (!user) loginAsGuest();
                  navigate('/dashboard');
                }} 
                className="btn btn-secondary" 
                style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'inline-block', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                {t('landing.btnDemo')}
              </button>
            </MagneticElement>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="container" style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '60px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('landing.socialProof', 'TRUSTED BY INNOVATIVE ENGINEERING TEAMS')}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.5 }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>AcmeCorp</h2>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, fontFamily: 'serif' }}>Globex</h2>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Soylent</h2>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, fontStyle: 'italic' }}>Initech</h2>
        </div>
      </section>

      {/* Mockup Section */}
      <section className="container" style={{ marginTop: '40px' }}>
        <SpotlightCard 
          style={{ padding: '2px', background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(124,58,237,0.2))' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ background: '#0d0d12', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <GitMerge color="var(--text-secondary)" size={20} />
              <span style={{ fontWeight: 600 }}>{t('landing.mockup.commit')} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>#104</span></span>
            </div>
            <div style={{ padding: '24px', display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 15px var(--accent-neon-glow)' }}>
                <Shield color="white" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>aegis-ai</span> <span style={{ background: 'var(--border-color)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>bot</span> <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>just now</span>
                </div>
                <div className="glass-panel" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '12px', fontWeight: 600 }}>
                    <ShieldAlert size={18} /> {t('landing.mockup.alert')}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {t('landing.mockup.desc')}
                  </p>
                  <div className="code-block" style={{ marginBottom: '12px' }}>
                    <div style={{ color: 'var(--danger)' }}>- const query = `SELECT * FROM users WHERE email = '${`{userInput}`}'`;</div>
                    <div style={{ color: 'var(--success)' }}>+ const query = 'SELECT * FROM users WHERE email = $1';</div>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>{t('landing.mockup.btnFix')}</button>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* Features */}
      <section className="container" style={{ marginTop: '120px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {[
          { icon: <Lock size={32} color="var(--accent-neon)" />, id: 'f1' },
          { icon: <Code2 size={32} color="var(--accent-neon)" />, id: 'f2' },
          { icon: <CheckCircle2 size={32} color="var(--accent-neon)" />, id: 'f3' }
        ].map((feature, idx) => (
          <SpotlightCard 
            key={idx} 
            style={{ padding: '32px', textAlign: 'center' }}
            whileHover={{ y: -10 }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{t(`landing.features.${feature.id}.title`)}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t(`landing.features.${feature.id}.desc`)}</p>
          </SpotlightCard>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="container" style={{ marginTop: '120px', maxWidth: '800px', marginBottom: '100px' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px' }}>{t('landing.faqTitle', 'Frequently Asked Questions')}</h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' }}
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
      </section>

      {/* Final CTA Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, transparent 0%, rgba(124, 58, 237, 0.05) 100%)', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', marginBottom: '24px', fontWeight: 800 }}>Ready to secure your codebase?</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join thousands of modern engineering teams who trust Aegis AI to prevent vulnerabilities before they reach production.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/scan" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>Start Free Trial</Link>
            <Link to="/pricing" className="btn btn-secondary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>View Pricing</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#06060c', borderTop: '1px solid var(--border-color)', padding: '60px 0 40px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Shield color="var(--accent-neon)" size={24} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Aegis<span className="neon-text">AI</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>{t('landing.footer.desc', 'Securing the future of open source and enterprise software, one commit at a time.')}</p>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            <div>
              <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>{t('landing.footer.product', 'Product')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                <Link to="/integrations">{t('landing.footer.features', 'Features')}</Link>
                <Link to="/pricing">{t('landing.footer.pricing', 'Pricing')}</Link>
                <Link to="/scan">{t('landing.footer.security', 'Security')}</Link>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>{t('landing.footer.company', 'Company')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                <Link to="/about">{t('landing.footer.about', 'About')}</Link>
                <Link to="/blog">{t('landing.footer.blog', 'Blog')}</Link>
                <Link to="/contact">{t('landing.footer.contact', 'Contact')}</Link>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Subscribe to Newsletter</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '250px', marginBottom: '16px' }}>
                Get the latest updates on AppSec, AI, and platform news.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="email" placeholder="Enter your email" style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', width: '100%' }} />
                <button className="btn btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', marginTop: '40px', paddingTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <p>{t('landing.footer.copyright', '© 2026 Aegis AI Inc. All rights reserved.')}</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://github.com/aegis-ai" target="_blank" rel="noopener noreferrer"><GithubIcon size={20} /></a>
            <a href="https://discord.com/invite/aegis-ai" target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
