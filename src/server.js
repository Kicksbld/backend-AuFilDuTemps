import 'dotenv/config';
import express from "express";
import cors from "cors";
import usersRouter from "./users.js";
import emailsRouter from "./email.js";
import paymentRouter from './payement.js';
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { PrismaClient } from "@prisma/client";
import { auth } from './lib/auth.js';

const app = express();
const prisma = new PrismaClient()
const port = 3000;

app.use(cors({
  origin:  process.env.FRONTEND_URL, // Replace with your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
     headers: fromNodeHeaders(req.headers),
   });
 return res.json(session);
});

app.use(express.json());

app.use("/users", usersRouter);
app.use("/sendEmail", emailsRouter);
app.use("/payement", paymentRouter);

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