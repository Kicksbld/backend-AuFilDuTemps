// payment.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_API_KEY); 
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { priceId } = req.body; 

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/order-review`, 
      cancel_url: `${req.headers.origin}/cancel`, 
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'An error occurred while creating the checkout session' });
  }
});

module.exports = router;