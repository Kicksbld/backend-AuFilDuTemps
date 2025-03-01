
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

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
  
module.exports = router;  
