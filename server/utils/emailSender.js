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
      from: `"ICTAK Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to ICTAK Dataset Gallery!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
          <div style="text-align: center;">
          </div>
          <h2 style="color: #005fa3;">Welcome to ICTAK Dataset Gallery!</h2>
          <p>Dear User,</p>
          <p>You have been successfully added to the ICTAK Dataset Gallery platform.</p>
          <p>Your temporary login password is:</p>
          <p style="font-size: 18px; font-weight: bold; background: #eef; padding: 10px; display: inline-block;">${password}</p>
          <p style="margin-top: 20px;">
            Use this password to log in and explore alumni projects, datasets, and curated content tailored for you.
          </p>
          <br/>
          <p>Warm regards,<br/>ICTAK  Team</p>
        </div>
      `,
    });
  };
  


module.exports = { sendPasswordEmail };
