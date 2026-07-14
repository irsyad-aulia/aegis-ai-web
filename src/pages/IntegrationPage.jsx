import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Copy, Server, Shield, GitBranch, MessageCircle, Code, Settings, ClipboardList, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import SpotlightCard from '../components/SpotlightCard';
import { useAuth } from '../context/AuthContext';

function IntegrationPage() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  
  const [integrations, setIntegrations] = useState({
    github: { isConnected: true },
    gitlab: { isConnected: false },
    jira: { isConnected: false },
    slack: { isConnected: false },
    discord: { isConnected: false }
  });

  useEffect(() => {
    if (!token) return;
    const fetchIntegrations = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/integrations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIntegrations(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data integrasi", err);
      }
    };
    fetchIntegrations();
  }, [token]);

  const handleToggle = async (provider) => {
    if (!token) return;
    if (provider === 'github') {
      toast.error('GitHub App adalah integrasi inti dan tidak bisa diputuskan.');
      return;
    }

    if ((provider === 'jira' || provider === 'gitlab') && user && !user.isPro) {
      toast.error('Fitur Enterprise. Silakan upgrade ke Pro/Team untuk mengaktifkannya.');
      return;
    }

    const currentState = integrations[provider].isConnected;
    const newState = !currentState;
    
    setIntegrations(prev => ({
      ...prev,
      [provider]: { isConnected: newState }
    }));

    try {
      const res = await fetch('http://localhost:3000/api/integrations/toggle', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider, isConnected: newState })
      });
      
      if (res.ok) {
        toast.success(`${provider.toUpperCase()} berhasil ${newState ? 'terhubung' : 'diputuskan'}.`);
      } else {
        setIntegrations(prev => ({ ...prev, [provider]: { isConnected: currentState } }));
        toast.error('Gagal mengubah status integrasi.');
      }
    } catch (err) {
      setIntegrations(prev => ({ ...prev, [provider]: { isConnected: currentState } }));
      toast.error('Gagal menghubungi server.');
    }
  };

  const IntegrationBox = ({ id, title, icon, isCore, requiresPro, comingSoon }) => {
    const isConnected = integrations[id]?.isConnected || false;
    
    const handleBoxClick = () => {
      if (comingSoon) {
        toast('🚀 Fitur ini sedang dalam tahap akhir pengembangan! Hubungi kami jika tim Anda segera membutuhkannya.', { icon: '🚧', duration: 4000 });
        return;
      }
      handleToggle(id);
    };

    return (
      <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon}
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {title}
              {requiresPro && !user?.isPro && !comingSoon && <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--accent-neon)', borderRadius: '10px', color: '#fff' }}>PRO</span>}
              {comingSoon && <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--warning, #f59e0b)', borderRadius: '10px', color: '#fff' }}>COMING SOON</span>}
            </h4>
            <span style={{ fontSize: '0.8rem', color: isConnected && !comingSoon ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              {isConnected && !comingSoon && (
                <span className="dot-pulse"></span>
              )}
              {isConnected && !comingSoon ? (isCore ? `Connected as @aegis-bot \u2022 Last sync: just now` : `Connected \u2022 Active`) : 'Not Connected'}
            </span>
          </div>
        </div>
        <button 
          className={isConnected && !comingSoon ? "btn btn-secondary" : "btn btn-primary"} 
          style={{ padding: '6px 12px', fontSize: '0.85rem', opacity: (requiresPro && !user?.isPro && !comingSoon) ? 0.7 : 1 }}
          onClick={handleBoxClick}
        >
          {isCore ? 'Configure' : (isConnected && !comingSoon ? 'Disconnect' : 'Connect')}
        </button>
      </div>
    );
  };

  const workflowCode = `name: Aegis AI Security Scan

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  aegis-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Run Aegis AI Scanner
        uses: aegis-ai/scan-action@v1
        with:
          api-key: \${{ secrets.AEGIS_API_KEY }}
          fail-on-critical: true
          
      - name: Upload Security Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: aegis-security-report
          path: aegis-report.pdf
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(workflowCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className="container" 
      style={{ padding: '60px 24px', maxWidth: '900px' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Helmet>
        <title>Integrations | Aegis AI</title>
        <meta name="description" content="Connect Aegis AI with your favorite CI/CD tools. Integrate with GitHub Actions, Slack, and custom webhooks for automated code security scanning." />
        <meta property="og:title" content="Integrations | Aegis AI" />
        <meta property="og:description" content="Seamlessly integrate automated code security scanning into your developer workflow." />
      </Helmet>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'rgba(124, 58, 237, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Server size={32} color="var(--accent-neon)" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('integration.title')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          {t('integration.subtitle')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        
        {/* Connection Status Panel */}
        <SpotlightCard style={{ padding: '32px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <Settings size={28} color="var(--text-primary)" />
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Active Connections</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <IntegrationBox id="github" title="GitHub App" icon={<GitBranch size={24} />} isCore={true} />
            <IntegrationBox id="gitlab" title="GitLab CI/CD" icon={<Server size={24} />} comingSoon={true} />
            <IntegrationBox id="jira" title="Jira Software" icon={<ClipboardList size={24} />} comingSoon={true} />
            <IntegrationBox id="slack" title="Slack Bot" icon={<MessageSquare size={24} />} comingSoon={true} />
            <IntegrationBox id="discord" title="Discord Webhook" icon={<MessageCircle size={24} />} comingSoon={true} />
          </div>
        </SpotlightCard>

        {/* GitHub Actions Snippet */}
        <SpotlightCard style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <Server size={32} />
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('integration.ghActions')}</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            {t('integration.ghActionsDesc')}
          </p>

          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', top: '12px', right: '12px', zIndex: 10 
            }}>
              <button 
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', gap: '6px' }}
              >
                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                {copied ? t('integration.copied') : t('integration.copy')}
              </button>
            </div>
            
            <pre style={{ 
              background: '#0d0d12', 
              padding: '24px', 
              borderRadius: '12px', 
              overflowX: 'auto',
              border: '1px solid rgba(255,255,255,0.05)',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#a5b4fc',
              margin: 0
            }}>
              <code>{workflowCode}</code>
            </pre>
          </div>
        </SpotlightCard>

        {/* Webhooks Config */}
        <SpotlightCard style={{ padding: '32px', background: 'rgba(124, 58, 237, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Code size={24} color="var(--accent-neon)" />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Custom Webhooks</h3>
            </div>
            {/* Toggle Switch */}
            <div 
              onClick={() => setWebhookEnabled(!webhookEnabled)}
              style={{ 
                width: '44px', height: '24px', background: webhookEnabled ? 'var(--accent-neon)' : 'rgba(255,255,255,0.2)', 
                borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' 
              }}
            >
              <div style={{ 
                width: '18px', height: '18px', background: '#fff', borderRadius: '50%', 
                position: 'absolute', top: '3px', left: webhookEnabled ? '23px' : '3px', transition: 'left 0.3s' 
              }} />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Trigger external CI/CD pipelines automatically when a scan completes.
          </p>
          
          <div style={{ opacity: webhookEnabled ? 1 : 0.4, pointerEvents: webhookEnabled ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="text" placeholder="https://your-ci-server.com/webhook" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', outline: 'none' }} />
              <button className="btn btn-secondary">Test Payload</button>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <style>{`
        .dot-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--success);
          display: inline-block;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulsing 2s infinite;
        }

        @keyframes pulsing {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </motion.div>
  );
}

export default IntegrationPage;
