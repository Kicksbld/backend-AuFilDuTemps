require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRouter = require("./users");
const emailsRouter = require("./email");
const paymentRouter = require('./payement');
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth";

const app = express();
const port = 3000;

app.all("/api/auth/*", toNodeHandler(auth))

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
     headers: fromNodeHeaders(req.headers),
   });
 return res.json(session);
});

app.use(express.json());
app.use(cors({
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use("/users", usersRouter);
app.use("/sendEmail", emailsRouter);
app.use("/payement", paymentRouter);

app.get("/", (req, res) => res.send("Express API running with Prisma on Vercel"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;