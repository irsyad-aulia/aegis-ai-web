import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const PageLoader = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#06060c', position: 'relative', zIndex: 9999 }}>
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        style={{ marginBottom: '24px' }}
      >
        <Shield color="var(--accent-neon)" size={64} style={{ filter: 'drop-shadow(0 0 25px rgba(124, 58, 237, 0.8))' }} />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ color: 'var(--accent-neon)', fontWeight: 600, letterSpacing: '3px', fontSize: '0.9rem', textTransform: 'uppercase', textShadow: '0 0 10px rgba(124, 58, 237, 0.5)' }}
      >
        Memuat Modul Keamanan...
      </motion.div>
      
      {/* Decorative pulse ring */}
      <motion.div
        animate={{ 
          scale: [0.8, 2],
          opacity: [0.5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeOut" 
        }}
        style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '2px solid var(--accent-neon)',
          top: 'calc(50% - 64px)', // Adjust based on shield position
        }}
      />
    </div>
  );
};

export default PageLoader;
