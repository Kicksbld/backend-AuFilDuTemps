import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from './lib/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all addresses for the current user
router.get('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        isDefault: 'desc'
      }
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new address
router.post('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { street, city, state, postalCode, country, label, isDefault } = req.body;

    // If this is set as default, unset any existing default address
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        street,
        city,
        state,
        postalCode,
        country,
        label,
        isDefault: isDefault || false
      }
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an address
router.patch('/:addressId', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { addressId } = req.params;
    const { street, city, state, postalCode, country, label, isDefault } = req.body;

    // If this is set as default, unset any existing default address
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: {
            not: parseInt(addressId)
          }
        },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.update({
      where: {
        id: parseInt(addressId),
        userId: session.user.id
      },
      data: {
        street,
        city,
        state,
        postalCode,
        country,
        label,
        isDefault
      }
    });

    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an address
router.delete('/:addressId', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { addressId } = req.params;

    // First check if the address exists
    const address = await prisma.address.findUnique({
      where: {
        id: parseInt(addressId),
        userId: session.user.id
      }
    });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.address.delete({
      where: {
        id: parseInt(addressId),
        userId: session.user.id
      }
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set an address as default
router.patch('/:addressId/default', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { addressId } = req.params;

    // First, unset any existing default address
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true
      },
      data: {
        isDefault: false
      }
    });

    // Then set the new default address
    const address = await prisma.address.update({
      where: {
        id: parseInt(addressId),
        userId: session.user.id
      },
      data: {
        isDefault: true
      }
    });

    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 