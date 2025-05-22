import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();  
    console.log("Users:", users);  
    res.json(users); 
  } catch (error) {
    console.error(error);  
    res.status(500).json({ error: "Something went wrong" }); 
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber } = req.body;

  try {
    // Validate required fields
    if (!name && !email && !phoneNumber) {
      return res.status(400).json({ error: "At least one field (name, email, or phoneNumber) is required" });
    }

    // Validate phone number format if provided
    if (phoneNumber) {
      // Remove any non-digit characters
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      
      // Check if the phone number is valid (adjust the length according to your needs)
      if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 15) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // If email is being updated, check if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber: phoneNumber.replace(/\D/g, '') }),
        updatedAt: new Date()
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
});
  
export default router;
