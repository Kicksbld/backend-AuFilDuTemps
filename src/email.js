// email.js
import express from "express";
import { Resend } from "resend";
import emailTemplate from "../Templates/email-template.js";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: "Portfolio <noreply@cbk-portfolio.com>",
      to: "killian.boularand@icloud.com",
      subject: "New Contact Form Submission",
      html: emailTemplate(name, email, message),
    });

    res.status(200).json({ message: "Email sent successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

export default router;