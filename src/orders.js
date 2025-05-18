import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from './lib/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { items, totalAmount } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: {
        id: parseInt(orderId),
        userId: session.user.id
      },
      data: {
        status
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order details
router.get('/:orderId', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId),
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 