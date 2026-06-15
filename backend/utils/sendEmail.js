const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,        // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,   // 10 seconds max to connect
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    // Verify connection before sending (helps debug)
    await transporter.verify();
    console.log('📧 Email server ready');

    const info = await transporter.sendMail({
      from: `"Pizza App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log('✅ Email sent:', info.messageId);
    return info;

  } catch (error) {
    // Log the error but DON'T crash the app
    // Registration still succeeds even if email fails
    console.error('❌ Email error:', error.message);
    // Don't throw — just return null so the route continues
    return null;
  }
};

module.exports = sendEmail;