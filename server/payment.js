const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./auth');

// Endpoint untuk membuat sesi pembayaran Stripe (Mock)
router.post('/create-transaction', auth.verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Di produksi, ini akan memanggil API Stripe untuk membuat Checkout Session
    // const session = await stripe.checkout.sessions.create({...})
    
    // Mock response untuk frontend
    setTimeout(() => {
      res.json({ 
        success: true, 
        clientSecret: 'mock_stripe_client_secret_xyz',
        transactionId: `TRX-${Date.now()}` 
      });
    }, 1000);

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: 'Gagal membuat transaksi pembayaran.' });
  }
});

// Endpoint Webhook untuk menerima status sukses dari Stripe
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  // Di produksi, verifikasi signature webhook dari Stripe
  // const sig = req.headers['stripe-signature'];
  
  try {
    const event = req.body; // Mock event
    
    // Jika event adalah checkout.session.completed (Mock)
    if (event.type === 'checkout.session.completed' || event.type === 'mock_success') {
      const userId = event.data?.object?.metadata?.userId || event.userId;
      
      if (userId) {
        await db.runQuery('UPDATE users SET is_pro = 1 WHERE id = ?', [userId]);
        console.log(`[PAYMENT] Akun user ${userId} berhasil di-upgrade ke PRO via Webhook Stripe.`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = { router };
