import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from './lib/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user preferences
router.get('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        gender: true,
        preferredSize: true,
        favoriteColor: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user preferences
router.patch('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { gender, preferredSize, favoriteColor } = req.body;

    const user = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        gender,
        preferredSize,
        favoriteColor
      },
      select: {
        gender: true,
        preferredSize: true,
        favoriteColor: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;