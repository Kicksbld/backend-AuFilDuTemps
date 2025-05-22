import 'dotenv/config';
import express from "express";
import cors from "cors";
import usersRouter from "./users.js";
import emailsRouter from "./email.js";
import paymentRouter from './payement.js';
import productsRouter from './product.js';
import favoritesRouter from './favorites.js';
import rewardsRouter from './rewards.js';
import ordersRouter from './orders.js';
import preferencesRouter from './preferences.js';
import addressesRouter from './addresses.js';
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { PrismaClient } from "@prisma/client";
import { auth } from './lib/auth.js';

const app = express();
const prisma = new PrismaClient()
const port = process.env.PORT || 3000;

// Update CORS configuration to handle Vercel deployment
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['*', 'Authorization']
}));

// Move express.json middleware before auth routes


app.all("/api/auth/*", toNodeHandler(auth));

app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch complete user information from the database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        gender: true,
        preferredSize: true,
        favoriteColor: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return both session and complete user data
    return res.json({
      ...session,
      user: {
        ...session.user,
        ...user
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

app.use(express.json());

app.use("/users", usersRouter);
app.use("/sendEmail", emailsRouter);
app.use("/payement", paymentRouter);
app.use("/products", productsRouter);
app.use("/favorites", favoritesRouter);
app.use("/rewards", rewardsRouter);
app.use("/orders", ordersRouter);
app.use("/preferences", preferencesRouter);
app.use("/addresses", addressesRouter);

app.get("/", (req, res) => res.send("Express API running with Prisma on Vercel"));

prisma
  .$connect()
  .then(() => {
    console.log("Connexion à la base de données réussie");
  })
  .catch((error) => {
    console.error("Erreur de connexion à la base de données:", error);
  });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;