import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();  
    console.log("products:", products);  
    res.json(products); 
  } catch (error) {
    console.error(error);  
    res.status(500).json({ error: "Something went wrong" }); 
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log("product:", product);  
    res.json(product); 
  } catch (error) {
    console.error(error);  
    res.status(500).json({ error: "Something went wrong" }); 
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, sizes, color, images, numberOfLikes, stock } = req.body;

    if (!name || !price || !color || !stock || !price, !sizes ) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        sizes,
        color,
        images,
        numberOfLikes,
        stock
      }
    });
    
    console.log("Created product:", product);  
    res.status(201).json(product);
  } catch (error) {
    console.error(error);  
    res.status(500).json({ error: "Failed to create product" }); 
  }
});

export default router;
