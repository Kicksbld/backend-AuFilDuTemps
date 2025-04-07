
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
  
export default router;
