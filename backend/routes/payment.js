const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const Donation = require('../models/Donation');
const generateInvoice = require('../utils/invoice');

// create a checkout session
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount required' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: 'NGO Donation' },
          unit_amount: Math.round(Number(amount) * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: process.env.FRONTEND_SUCCESS_URL || 'http://localhost:5173/success',
      cancel_url: process.env.FRONTEND_CANCEL_URL || 'http://localhost:5173/cancel',
      metadata: {
        userId: req.user._id.toString(),
        amount: amount.toString()
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// webhook endpoint would go here to verify payment and create Donation entry
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  // Implement webhook verification in production
  res.json({ received: true });
});

module.exports = router;
