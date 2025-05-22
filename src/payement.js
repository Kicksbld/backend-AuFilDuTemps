// payment.js
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { items } = req.body; 

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.priceId || !item.quantity) {
        return res.status(400).json({ error: 'Each item must have priceId and quantity' });
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: items.map(item => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/order-review`, 
      cancel_url: `${req.headers.origin}`, 
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'An error occurred while creating the checkout session' });
  }
});

export default router;