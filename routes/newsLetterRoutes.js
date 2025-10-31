import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // ✅ Create transporter for email sending
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === "465", // true for 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Send confirmation email to user
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4B0082;">Thank you!</h2>
        <p>You have successfully signed the following email address up for our newsletter:</p>
        <p><strong>${email}</strong></p>
        <p>You’ll receive emails with the latest <strong>Roastar updates</strong>!</p>
        <br />
        <p>You're joining the <strong>Mylar Bags Packaging</strong> community 🎉</p>
        <p>Stay tuned for exciting offers, new packaging ideas, and updates!</p>
        <br />
        <p>— The Mylar Bags Packaging Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Mylar Bags Packaging" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "🎉 Welcome to Mylar Bags Packaging Newsletter!",
      html,
    });

    return res.json({
      message: `Thank you! Confirmation email sent to ${email}`,
    });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ message: "Error sending email" });
  }
});

export default router;
