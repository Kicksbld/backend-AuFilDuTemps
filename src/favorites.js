import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from './lib/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's favorites
router.get('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: true
      }
    });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product to favorites
router.post('/:productId', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.params;

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId: parseInt(productId)
      },
      include: {
        product: true
      }
    });

    res.json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove product from favorites
router.delete('/:productId', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.params;

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: parseInt(productId)
        }
      }
    });

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 