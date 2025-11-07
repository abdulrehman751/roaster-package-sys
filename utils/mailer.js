import nodemailer from "nodemailer";

const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT, 10)
    : undefined;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be set in environment");
  }

  const transportOptions = host
    ? { host, port, secure, auth: { user, pass } }
    : { service: "gmail", auth: { user, pass } };

  const transporter = nodemailer.createTransport(transportOptions);

  transporter.verify().catch((err) =>
    console.error("Mail transporter verify failed:", err.message || err)
  );

  return transporter;
};


// ✅ ✅ ✅ FIRST FUNCTION — CLOSED PROPERLY ✅ ✅ ✅
export const sendVerificationEmail = async (toEmail, name, token) => {
  const transporter = createTransporter();

  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl.replace(/\/$/, "")}/verify/${token}`;

  const html = `
    <div>
      <h2>Welcome to Mylar Bags!</h2>
      <p>Hi ${name || "User"},</p>
      <a href="${verifyUrl}">Verify your email</a>
    </div>
  `;

  return await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: toEmail,
    subject: "Verify your Mylar Bags account",
    html,
  });
};
// ✅ FUNCTION ENDS HERE ✅


// ✅ ✅ ✅ SECOND FUNCTION — SEPARATE ✅ ✅ ✅
export const sendPasswordResetEmail = async (toEmail, name, token) => {
  const transporter = createTransporter();

  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password/${token}`;

  const html = `
    <div>
      <h2>Password Reset Request</h2>
      <p>Hi ${name || "User"},</p>
      <a href="${resetUrl}">Reset Password</a>
    </div>
  `;

  return await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: toEmail,
    subject: "Reset Your Password",
    html,
  });
};
