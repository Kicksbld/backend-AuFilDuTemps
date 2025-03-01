require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRouter = require("./users");
const emailsRouter = require("./email");
const paymentRouter = require('./payement'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/sendEmail", emailsRouter);
app.use("/payement", paymentRouter);

app.get("/", (req, res) => res.send("Express API running with Prisma on Vercel"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;