import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle, ShieldX, Download, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SpotlightCard from '../components/SpotlightCard';
import { useAuth } from '../context/AuthContext';
import html2pdf from 'html2pdf.js';

function ReportPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  let reportData = location.state?.reportData;
  
  // Ambil dari memori lokal jika tidak ada di state navigasi (misal kembali dari halaman lain / reload)
  if (!reportData) {
    const savedData = localStorage.getItem('aegisLastScan');
    if (savedData) {
      try {
        reportData = JSON.parse(savedData);
      } catch (e) {
        console.error("Gagal membaca data laporan dari memori lokal", e);
      }
    }
  }

  if (!reportData) {
    return (
      <div className="container" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Tidak Ada Data Laporan</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Anda belum melakukan pemindaian apa pun.</p>
        <Link to="/scan" className="btn btn-primary">Kembali ke Pemindai</Link>
      </div>
    );
  }

  const {
    scanId,
    fileName,
    timestamp,
    overallScore,
    status,
    vulnerabilitiesFound,
    vulnerabilities,
    aiSummary
  } = reportData;

  const getStatusColor = (s) => {
    if (s === 'secure') return 'var(--success)';
    if (s === 'warning') return 'var(--warning)';
    return 'var(--danger)';
  };

  const getStatusIcon = (s) => {
    if (s === 'secure') return <CheckCircle size={32} color="var(--success)" />;
    if (s === 'warning') return <AlertTriangle size={32} color="var(--warning)" />;
    return <ShieldX size={32} color="var(--danger)" />;
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin:       0.5,
      filename:     `Aegis_Report_${scanId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Simpan elemen UI asli
    const originalBg = element.style.background;
    element.style.background = '#0d0d12'; // Set background gelap untuk PDF
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.background = originalBg;
    });
  };

  const handleCopyJira = (vuln) => {
    const jiraText = `*Vulnerability:* ${vuln.type}\n*File:* ${vuln.fileName} (Line: ${vuln.line})\n*Severity:* ${vuln.severity}\n\n*Description:*\n${vuln.description}\n\n*Recommendation:*\n${vuln.recommendation}`;
    navigator.clipboard.writeText(jiraText);
    alert(t('integration.copied')); // Reusing copied text
  };

  return (
    <motion.div 
      className="container" 
      style={{ padding: '40px 24px', maxWidth: '1000px' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Helmet>
        <title>Security Report {scanId ? `- ${scanId}` : ''} | Aegis AI</title>
        <meta name="description" content={`Detailed security audit report for ${fileName || 'your codebase'}. View vulnerabilities, severity levels, and AI-powered recommendations.`} />
      </Helmet>

      {user?.isGuest && (
        <div style={{ background: 'rgba(239, 160, 11, 0.1)', border: '1px solid var(--warning)', color: 'var(--warning)', padding: '16px', borderRadius: '12px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <strong>{t('report.demoModeTitle', 'Mode Demo:')}</strong> {t('report.demoModeDesc', 'Ini adalah laporan contoh. Anda dalam mode read-only.')}
          </div>
          <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            {t('dashboard.btnRegisterNow', 'Daftar Sekarang')}
          </button>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/scan')}
          className="btn btn-secondary" 
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> {t('report.back')}
        </button>

        <button 
          onClick={handleDownloadPDF}
          className="btn btn-primary" 
          style={{ padding: '8px 16px', fontSize: '0.9rem', gap: '8px' }}
        >
          <Download size={16} /> {t('report.downloadPdf')}
        </button>
      </div>

      <div id="report-content" style={{ padding: '20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{t('report.title')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
            ID: {scanId} | File: {fileName}
          </p>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {new Date(timestamp).toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <SpotlightCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '12px' }}>{t('report.score')}</h3>
          <div className="neon-text" style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, color: getStatusColor(status) }}>
            {overallScore}
          </div>
        </SpotlightCard>
        
        <SpotlightCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '12px' }}>{t('report.status')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {getStatusIcon(status)}
            <span style={{ fontSize: '2.5rem', fontWeight: 800, textTransform: 'capitalize', color: getStatusColor(status) }}>
              {status}
            </span>
          </div>
        </SpotlightCard>

        <SpotlightCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '12px' }}>{t('report.totalVulns')}</h3>
          <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, color: vulnerabilitiesFound > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
            {vulnerabilitiesFound}
          </div>
        </SpotlightCard>
      </div>

      <SpotlightCard style={{ padding: '24px', marginBottom: '40px', background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={20} color="var(--accent-neon)" /> {t('report.conclusion')}
        </h3>
        <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          {aiSummary}
        </p>
      </SpotlightCard>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{t('report.vulnDetails')}</h2>
      
      {vulnerabilitiesFound === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: 'var(--success)' }}>{t('report.noVulns')}</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {vulnerabilities.map((vuln, idx) => (
            <motion.div 
              key={vuln.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <SpotlightCard style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ 
                  padding: '16px 24px', 
                  background: vuln.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 
                              vuln.severity === 'high' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: vuln.severity === 'critical' ? 'var(--danger)' : 
                                  vuln.severity === 'high' ? 'var(--warning)' : 'var(--text-muted)',
                      color: '#000'
                    }}>
                      {vuln.severity}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{vuln.type}</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                      {vuln.fileName} : {t('report.line')} {vuln.line}
                    </div>
                    <button 
                      onClick={() => handleCopyJira(vuln)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px' }}
                      title="Copy to Jira"
                    >
                      <ClipboardList size={14} />
                      {t('report.copyJira')}
                    </button>
                  </div>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <p style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>{vuln.description}</p>
                  
                  <div style={{ 
                    background: '#0d0d12', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    fontFamily: 'monospace',
                    marginBottom: '16px',
                    borderLeft: '4px solid var(--danger)',
                    overflowX: 'auto',
                    whiteSpace: 'pre'
                  }}>
                    <code style={{ color: '#ff7b72' }}>{vuln.codeSnippet}</code>
                  </div>
                  
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                    <h4 style={{ color: 'var(--success)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase' }}>{t('report.recommendation')}</h4>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>{vuln.recommendation}</p>
                  </div>

                  {vuln.fixedCode && (
                    <div style={{ marginTop: '24px', position: 'relative' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-neon)', marginBottom: '12px' }}>
                        <span>✨</span> Aegis Auto-Patch (Pro)
                      </h4>
                      <div style={{ 
                        position: 'relative', 
                        background: '#0d0d12', 
                        padding: '16px', 
                        borderRadius: '8px', 
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          fontFamily: 'monospace',
                          color: '#4ade80',
                          whiteSpace: 'pre',
                          filter: user?.isPro ? 'none' : 'blur(5px)',
                          opacity: user?.isPro ? 1 : 0.5,
                          userSelect: user?.isPro ? 'auto' : 'none'
                        }}>
                          {vuln.fixedCode}
                        </div>
                        
                        {!user?.isPro && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(18, 18, 26, 0.6)',
                            backdropFilter: 'blur(2px)'
                          }}>
                            <button 
                              onClick={() => navigate('/pricing')}
                              className="btn btn-primary"
                              style={{
                                boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
                                fontWeight: 700,
                                letterSpacing: '0.5px'
                              }}
                            >
                              Upgrade ke PRO untuk Membuka Kode
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </motion.div>
  );
}

export default ReportPage;
