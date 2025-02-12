const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});