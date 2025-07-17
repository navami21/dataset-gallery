// routes/adminUpload.js
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");
const User = require("../model/userData");
const { sendPasswordEmail } = require("../utils/emailSender"); // custom function
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { verify } = require("jsonwebtoken");



// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

function generateRandomPassword() {
  return Math.random().toString(36).slice(2, 8); // 6 char alphanumeric
}

// Upload Excel file
router.post("/upload-users",verifyToken,isAdmin, upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(sheet); // assumes headers like 'name' and 'email'

    const newUsers = [];

    for (let userData of users) {
      const { name, email } = userData;

      const existing = await User.findOne({ email });
      if (existing) continue; // skip if already exists

      const rawPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });
      console.log("Before save - password:", newUser.password);

      await newUser.save();
      console.log("After save - password in DB:", (await User.findOne({ email })).password);

      await sendPasswordEmail(email, rawPassword); // utility function to send email

      newUsers.push(email);
    }

    res.status(200).json({ message: "Users created", users: newUsers });
    console.log("Parsed users from Excel:", users);

  } catch (err) {
    res.status(500).json({ message: "Error uploading users", error: err.message });
  }
});

module.exports = router;
