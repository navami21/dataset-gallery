const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const sendPasswordEmail = async (to, password) => {
  await transporter.sendMail({
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to Dataset Gallery – Your Login Password Inside!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2b6cb0;">Welcome to <span style="color:#1a202c;">Dataset Gallery</span>!</h2>
        <p>Hi there,</p>
        <p>We're excited to have you onboard. You’ve been successfully registered to our platform where you can explore, interact with, and learn from alumni datasets related to AI/ML, DSA, and more.</p>
        <p>Your temporary login password is:</p>
        <p style="font-size: 18px; font-weight: bold; color: #d53f8c;">${password}</p>
        <p>Please use this password to log in. We recommend you change it after your first login for better security.</p>
        <br/>
        <p>Happy exploring!</p>
        <p>– Dataset Gallery Team</p>
      </div>
    `,
  });
};


module.exports = { sendPasswordEmail };
