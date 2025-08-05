// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, 
//   },
// });

// const sendPasswordEmail = async (to, password) => {
//     await transporter.sendMail({
//       from: `"ICTAK Admin" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "Welcome to ICTAK Dataset Gallery!",
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
//           <div style="text-align: center;">
//           </div>
//           <h2 style="color: #005fa3;">Welcome to ICTAK Dataset Gallery!</h2>
//           <p>Dear User,</p>
//           <p>You have been successfully added to the ICTAK Dataset Gallery platform.</p>
//           <p>Your temporary login password is:</p>
//           <p style="font-size: 18px; font-weight: bold; background: #eef; padding: 10px; display: inline-block;">${password}</p>
//           <p style="margin-top: 20px;">
//             Use this password to log in and explore alumni projects, datasets, and curated content tailored for you.
//           </p>
//           <br/>
//           <p>Warm regards,<br/>ICTAK  Team</p>
//         </div>
//       `,
//     });
//   };
//   const sendResetLinkEmail = async (to, name, resetLink) => {
//   await transporter.sendMail({
//     from: `"ICTAK Admin" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Reset Your ICTAK Dataset Gallery Password",
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
//         <h2 style="color: #d9534f;">Reset Your Password</h2>
//         <p>Dear ${name || "User"},</p>
//         <p>We received a request to reset your password. Click the link below to set a new password:</p>
//         <p>
//           <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
//         </p>
//         <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
//         <br/>
//         <p>Regards,<br/>ICTAK Team</p>
//       </div>
//     `,
//   });
// };


// module.exports = { sendPasswordEmail, sendResetLinkEmail };

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || process.env.MAIL_USER,
    pass: process.env.EMAIL_PASS || process.env.MAIL_PASS,
  },
});

// Send welcome password email
const sendPasswordEmail = async (to, password) => {
  await transporter.sendMail({
    from: `"ICTAK Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to ICTAK Dataset Gallery!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
        <h2 style="color: #005fa3;">Welcome to ICTAK Dataset Gallery!</h2>
        <p>Dear User,</p>
        <p>You have been successfully added to the ICTAK Dataset Gallery platform.</p>
        <p>Your temporary login password is:</p>
        <p style="font-size: 18px; font-weight: bold; background: #eef; padding: 10px; display: inline-block;">${password}</p>
        <p style="margin-top: 20px;">
          Use this password to log in and explore alumni projects, datasets, and curated content tailored for you.
        </p>
        <br/>
        <p>Warm regards,<br/>ICTAK Team</p>
      </div>
    `,
  });
};

// Send reset password link email
const sendResetLinkEmail = async (to, name, resetLink) => {
  await transporter.sendMail({
    from: `"ICTAK Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your ICTAK Dataset Gallery Password",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
        <h2 style="color: #d9534f;">Reset Your Password</h2>
        <p>Dear ${name || "User"},</p>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </p>
        <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
        <br/>
        <p>Regards,<br/>ICTAK Team</p>
      </div>
    `,
  });
};

// Send reply email (e.g., contact form response)
const sendReplyEmail = async (to, name, reply) => {
  await transporter.sendMail({
    from: `"ICTAK Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reply from ICT Kerala",
    html: `
      <p>Dear ${name},</p>
      <p>${reply}</p>
      <p>Regards,<br/>ICT Academy Team</p>
    `,
  });
};

// Export all functions
module.exports = {
  sendPasswordEmail,
  sendResetLinkEmail,
  sendReplyEmail,
};
