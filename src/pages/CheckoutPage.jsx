import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function CheckoutPage() {
  const navigate = useNavigate();
  const { upgradeToPro } = useAuth();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulasi proses gateway pembayaran (misal Stripe)
    setTimeout(() => {
      upgradeToPro();
      setIsProcessing(false);
      toast.success(t('checkout.success'));
      navigate('/report');
    }, 2000);
  };

  return (
    <div className="container" style={{ padding: '60px 24px', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'rgba(18, 18, 26, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <ShieldCheck size={64} color="var(--accent-neon)" />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>{t('checkout.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {t('checkout.subtitle')}
        </p>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', marginBottom: '32px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
            <span>Aegis Pro</span>
            <span>$24.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
            <span>Tax (0%)</span>
            <span>$0.00</span>
          </div>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
            <span>Total</span>
            <span className="neon-text">$24.00</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '12px', marginBottom: '24px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>{t('checkout.card') || 'Card Details'}</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Card Number (e.g. 4242 4242 4242 4242)" 
              style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: 'white' }}
              disabled={isProcessing}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="MM / YY" 
                style={{ width: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: 'white' }}
                disabled={isProcessing}
              />
              <input 
                type="text" 
                placeholder="CVC" 
                style={{ width: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: 'white' }}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary animate-pulse-glow" 
          style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginBottom: '16px', background: 'linear-gradient(90deg, #7c3aed, #0ea5e9)', border: 'none' }}
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader2 size={20} className="animate-spin" /> Processing Payment...
            </span>
          ) : (
            <span>{t('checkout.pay')} $24.00</span>
          )}
        </button>

        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', background: 'transparent', border: 'none' }}
          onClick={() => navigate('/pricing')}
          disabled={isProcessing}
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default CheckoutPage;
