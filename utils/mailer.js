const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendVerificationEmail=  async  (toEmail, name, token)=> {
  const verifyUrl = `${process.env.BASE_URL}/verify/${token}`;
  const html = `
    <p>Hi ${name || 'User'},</p>
    <p>Thank you for registering. Please click the link below to verify your email:</p>
    <p><a href="${verifyUrl}">Verify your email</a></p>
    <p>If the link doesn't work, copy-paste this URL into your browser:</p>
    <p>${verifyUrl}</p>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: 'Please verify your email',
    html
  });
}


