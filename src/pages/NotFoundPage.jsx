import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Helmet>
        <title>404 Not Found - Aegis AI</title>
      </Helmet>

      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginBottom: '24px' }}
        >
          <ShieldAlert size={100} color="var(--danger)" opacity={0.8} />
        </motion.div>
        
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: 900, 
          margin: 0, 
          lineHeight: 1,
          background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.3) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '16px 0 8px 0', fontWeight: 600 }}>
          Breach Detected: Sector Not Found
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 0 40px 0', lineHeight: 1.6 }}>
          The page you are looking for has either been moved, deleted, or is classified above your current clearance level.
        </p>

        <Link 
          to="/" 
          className="btn btn-primary"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '16px 32px', 
            borderRadius: '30px',
            fontSize: '1.1rem'
          }}
        >
          <ArrowLeft size={20} />
          Return to Safe Zone
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
