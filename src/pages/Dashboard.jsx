import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { GitBranch, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SpotlightCard from '../components/SpotlightCard';
import { useAuth } from '../context/AuthContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { API_URL } from '../config';

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dashboardData, setDashboardData] = useState({
    trendData: [],
    repos: [],
    pieData: [],
    global: { score: 100, totalRepos: 0, totalIssues: 0 }
  });
  
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error("Gagal mengambil data dashboard:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewLogs = async (scanId) => {
    if (!scanId) return;
    try {
      const res = await fetch(`${API_URL}/api/scan/${scanId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const reportData = await res.json();
        navigate('/report', { state: { reportData } });
      } else {
        alert('Data laporan lengkap tidak ditemukan di database.');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mengambil detail laporan dari server.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { trendData, repos, pieData, global } = dashboardData;

  const filteredRepos = repos.filter(repo => {
    const matchSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || repo.statusKey === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDownloadPDF = () => {
    const element = document.getElementById('dashboard-content');
    html2canvas(element, { scale: 2, backgroundColor: '#06060c' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Aegis_Executive_Report.pdf');
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '12px', background: 'rgba(18,18,26,0.9)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: 'var(--accent-neon)', fontWeight: 600 }}>{payload[0].value} {t('dashboard.vulnLabel') || 'Vulnerabilities'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container" style={{ padding: '40px 20px' }}>
      <Helmet>
        <title>Dashboard | Aegis AI</title>
        <meta name="description" content="View your security score, monitored repositories, and vulnerability trends in real-time." />
      </Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{t('dashboard.title')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{t('dashboard.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={handleDownloadPDF}>
             {t('dashboard.download')}
          </button>
          <button className="btn btn-primary" onClick={fetchDashboardData}>
            <RefreshCw size={18} className={isLoading ? 'spin-anim' : ''} /> {t('dashboard.btnSync')}
          </button>
        </div>
      </div>

      <div id="dashboard-content" style={{ position: 'relative' }}>
        
        {/* Paywall Overlay for Free Users */}
        {user && !user.isPro && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(6, 6, 12, 0.6)', backdropFilter: 'blur(8px)',
            zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '16px'
          }}>
            <div style={{ background: '#12121a', padding: '40px', borderRadius: '16px', border: '1px solid var(--accent-neon)', textAlign: 'center', maxWidth: '400px', boxShadow: '0 0 40px rgba(124, 58, 237, 0.2)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertTriangle size={32} color="var(--accent-neon)" />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{t('dashboard.locked')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                {t('dashboard.lockedDesc')}
              </p>
              <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => navigate('/pricing')}>
                {t('dashboard.upgradePro')}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <SpotlightCard style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '12px' }}>{t('dashboard.scoreTitle')}</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span className="neon-text" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{global.score}</span>
            {global.score >= 90 ? <span style={{ color: 'var(--success)', fontWeight: 600, paddingBottom: '6px' }}>Excelent</span> : <span style={{ color: 'var(--warning)', fontWeight: 600, paddingBottom: '6px' }}>Needs Attention</span>}
          </div>
        </SpotlightCard>
        <SpotlightCard style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '12px' }}>{t('dashboard.reposTitle')}</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{global.totalRepos}</div>
        </SpotlightCard>
        <SpotlightCard style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '12px' }}>{t('dashboard.vulnTitle')}</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: global.totalIssues > 0 ? 'var(--accent-secondary)' : 'var(--success)' }}>{global.totalIssues}</div>
        </SpotlightCard>
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <SpotlightCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>{t('dashboard.trendTitle') || 'Vulnerabilities Trend (30 Days)'}</h3>
          {isLoading ? (
            <div className="skeleton" style={{ width: '100%', height: '300px' }}></div>
          ) : (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-neon)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent-neon)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="var(--accent-neon)" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SpotlightCard>
        
        <SpotlightCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>{t('dashboard.distTitle') || 'Severity Distribution'}</h3>
          {isLoading ? (
            <div className="skeleton" style={{ width: '100%', height: '300px' }}></div>
          ) : (
            <div>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                {pieData.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: entry.color }}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SpotlightCard>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{t('dashboard.tableTitle')}</h2>
      <SpotlightCard style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Monitored Repositories</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Search repository..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ width: '200px', padding: '8px 12px' }}
            />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="input-field" 
              style={{ padding: '8px 12px' }}
            >
              <option value="all">All Status</option>
              <option value="clean">Clean</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>{t('dashboard.thRepo')}</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>{t('dashboard.thStatus')}</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>{t('dashboard.thIssues')}</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>{t('dashboard.thScan')}</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>{t('dashboard.thAction')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={`skel-${i}`} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}><div className="skeleton" style={{ width: '150px', height: '24px' }}></div></td>
                  <td style={{ padding: '16px 24px' }}><div className="skeleton" style={{ width: '80px', height: '24px' }}></div></td>
                  <td style={{ padding: '16px 24px' }}><div className="skeleton" style={{ width: '40px', height: '24px' }}></div></td>
                  <td style={{ padding: '16px 24px' }}><div className="skeleton" style={{ width: '100px', height: '24px' }}></div></td>
                  <td style={{ padding: '16px 24px' }}><div className="skeleton" style={{ width: '80px', height: '32px' }}></div></td>
                </tr>
              ))
            ) : filteredRepos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {t('dashboard.noData')}
                </td>
              </tr>
            ) : filteredRepos.map((repo, i) => (
              <motion.tr 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <GitBranch size={20} color="var(--text-secondary)" />
                    <span style={{ fontWeight: 600 }}>{repo.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                    background: repo.statusKey === 'clean' ? 'rgba(16, 185, 129, 0.1)' : repo.statusKey === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: repo.statusKey === 'clean' ? 'var(--success)' : repo.statusKey === 'critical' ? 'var(--danger)' : 'var(--warning)'
                  }}>
                    {repo.statusKey === 'clean' ? <CheckCircle size={14} /> : repo.statusKey === 'critical' ? <XCircle size={14} /> : <AlertTriangle size={14} />}
                    {t(`dashboard.status.${repo.statusKey}`)}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: repo.issues > 0 ? 600 : 400, color: repo.issues > 0 ? 'var(--danger)' : 'inherit' }}>
                  {repo.issues}
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{repo.timeAgoStr}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      onClick={() => handleViewLogs(repo.scanId)}
                    >
                      {t('dashboard.btnLogs')}
                    </button>
                    {user && user.isPro && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#60a5fa', borderColor: 'rgba(96, 165, 250, 0.3)' }}
                      >
                        Jira
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </SpotlightCard>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}

export default Dashboard;
