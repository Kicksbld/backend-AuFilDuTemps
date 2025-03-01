// email.js
const express = require("express");
const { Resend } = require("resend");
const emailTemplate = require("../Templates/email-template.js"); // Ensure this is a CommonJS module

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: "Portfolio <noreply@cbk-portfolio.com>",
      to: "killian.boularand@icloud.com", // Replace with your support email
      subject: "New Contact Form Submission",
      html: emailTemplate(name, email, message),
    });

    res.status(200).json({ message: "Email sent successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

module.exports = router;