// ...existing code...
import nodemailer from 'nodemailer';

const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const secure = (process.env.SMTP_SECURE === 'true') || port === 465;

  console.log('Creating mail transport with:', { host, port, user, secure: !!secure });

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS must be set in environment');
  }

  const transportOptions = host
    ? { host, port, secure, auth: { user, pass } }
    : { service: 'gmail', auth: { user, pass } };
    console.log('Creating mail transport with:', { host, port, user, secure: !!secure });


  const transporter = nodemailer.createTransport(transportOptions);

  // verify connection configuration early
  transporter.verify()
    .then(() => console.log('Mail transporter verified OK'))
    .catch(err => console.error('Mail transporter verify failed:', err.message || err));

  return transporter;
};

export const sendVerificationEmail = async (toEmail, name, token) => {
  const transporter = createTransporter();

  const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';

   const verifyUrl = `${baseUrl.replace(/\/$/, '')}/verify/${token}`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2>Welcome to Mylar Bags!</h2>
      <p>Hi ${name || 'User'},</p>
      <p>Thank you for registering. Please click the button below to verify your email:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
          Verify your email
        </a>
      </div>
      <p>If the button doesn't work, copy-paste this URL into your browser:</p>
      <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all;">
        ${verifyUrl}
      </p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      subject: 'Please verify your Mylar Bags account',
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error.message || error);
    throw error;
  }
};
// ...existing code...