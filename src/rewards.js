import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from './lib/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's rewards
router.get('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const rewards = await prisma.reward.findMany({
      where: {
        userId: session.user.id
      }
    });

    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new reward to user
router.post('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, imageUrl } = req.body;

    const reward = await prisma.reward.create({
      data: {
        name,
        imageUrl,
        userId: session.user.id
      }
    });

    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a reward
router.delete('/:rewardId', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { rewardId } = req.params;

    await prisma.reward.delete({
      where: {
        id: parseInt(rewardId),
        userId: session.user.id
      }
    });

    res.json({ message: 'Reward deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 