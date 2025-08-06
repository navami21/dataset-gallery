const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userData");  
const { verifyToken } = require("../middleware/authMiddleware"); 
const Like= require("../model/likeData");
const Comment=require("../model/commentData");
const ActivityLog = require("../model/activitylogData");
const { sendResetLinkEmail } = require("../utils/emailSender");



// Admin Registration 
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checks if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

// Login (for both admin & users)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
 user.isOnline = true;
    user.lastActive = new Date();
    await user.save();
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    await ActivityLog.create({
  user: user._id,
  action: "login",
  timestamp: new Date(),
});

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnline: user.isOnline

      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.post("/logout", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      isOnline: false,
      lastActive: new Date()
    });
    await ActivityLog.create({
      user: req.user.userId,
      action: "logout",
      timestamp: new Date(),
    });

    res.status(200).json({ message: "Logout recorded" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
});
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ message: "Error fetching user info" });
  }
});
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Find the user first
    const user = await User.findById(req.user.userId);
    console.log("Logged in user ID:", req.userId);
    console.log("Found user email:", user.email);

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("currentPassword from user:", currentPassword);
    console.log("user.password from DB:", user.password);
    console.log("Does password match:", await bcrypt.compare(currentPassword.trim(), user.password));

    // Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword.trim(), user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
});
// 🔐 Step 1: Forgot password - send email with reset link
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user found with this email" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendResetLinkEmail(user.email, user.name, resetLink);
    console.log("Found user:", user.email);
    console.log("Reset link:", resetLink);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Error in /forgot-password route:", err);
    res.status(500).json({ message: "Failed to send reset email", error: err.message });
  }
});

// 🔐 Step 2: Reset password using token from email
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
});

//like a dataset
router.post("/like/:datasetId", verifyToken, async (req, res) => {
  const { datasetId } = req.params;
  const userId = req.user.userId;

  try {
    // Check if already liked
    const existing = await Like.findOne({ user: userId, dataset: datasetId });
    if (existing) return res.status(400).json({ message: "Already liked" });

    const like = new Like({ user: userId, dataset: datasetId });
    await like.save();
    res.status(201).json({ message: "Liked" });
  } catch (err) {
    res.status(500).json({ message: "Error liking", error: err.message });
  }
});
// Adding comment to a dataset
router.post("/comment/:datasetId", verifyToken, async (req, res) => {
  const { datasetId } = req.params;
  const userId = req.user.userId;
  const { comment } = req.body;

  try {
   // Fix: rename local variable
const newComment = new Comment({ user: userId, dataset: datasetId, comment });
await newComment.save();
res.status(201).json({ message: "Comment added" });

  } catch (err) {
    res.status(500).json({ message: "Error commenting", error: err.message });
  }
});

router.get("/dataset/:datasetId/stats", verifyToken,async (req, res) => {
  const { datasetId } = req.params;

  try {
    const likeCount = await Like.countDocuments({ dataset: datasetId });
    const commentCount = await Comment.countDocuments({ dataset: datasetId });

    res.status(200).json({
      likes: likeCount,
      comments: commentCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
});


module.exports = router;
