// routes/adminUpload.js
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");
const User = require("../model/userData");
const { sendPasswordEmail } = require("../utils/emailSender"); // custom function
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
// const { verify } = require("jsonwebtoken");
const Like=require("../model/likeData");
const Comment=require("../model/commentData");

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

function generateRandomPassword() {
  return Math.random().toString(36).slice(-6) + Math.random().toString(36).toUpperCase().slice(-2);
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

// Get likes for a dataset (admin only)
router.get("/like/:datasetId", verifyToken, isAdmin, async (req, res) => {
  try {
    const likes = await Like.find({ dataset: req.params.datasetId }).populate("user", "name email");
    res.json({
      totalLikes: likes.length,
      likedBy: likes.map((l) => l.user),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching likes", error: err.message });
  }
});



// Get all comments for a dataset (admin only)
router.get("/comment/:datasetId", verifyToken, isAdmin, async (req, res) => {
  try {
    const comments = await Comment.find({ dataset: req.params.datasetId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      totalComments: comments.length,
      comments: comments.map((c) => ({
        user: c.user,
        content: c.content,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
});
module.exports = router;
