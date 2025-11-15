// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    // 1. Create a "transporter" - the service that will send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email from .env
        pass: process.env.EMAIL_PASS  // Your app password from .env
      }
    });

    // 2. Define the email options
    const mailOptions = {
      from: `"TCC System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

module.exports = sendEmail;