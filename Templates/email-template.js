// Templates/email-template.js
const emailTemplate = (name, email, message) => `
  <div>
    <h1>New Contact Form Submission</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  </div>
`;

module.exports = emailTemplate; // Use CommonJS export