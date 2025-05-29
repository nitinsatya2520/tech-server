// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



app.post('/send-estimate', async (req, res) => {
  const { name, email, items, total } = req.body;

  const itemList = items.map(i => `- ${i}`).join('<br/>');

  const htmlContent = `
    <h3>Estimate for ${name}</h3>
    <p><strong>Client Email:</strong> ${email}</p>
    <p><strong>Selected Services:</strong><br/>${itemList}</p>
    <p><strong>Total Estimate:</strong> ₹${total.toLocaleString()}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Techverra Solutions" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Project Estimate from Techverra Solutions',
      html: htmlContent,
    });

    console.log(`Estimate sent to ${email}`);
    res.json({ message: 'Estimate sent successfully!' });
  } catch (error) {
    console.error('Email send failed:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Email server running on port ${PORT}`));
