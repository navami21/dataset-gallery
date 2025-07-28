// routes/adminUpload
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
const ActivityLog = require("../model/activitylogData");
const mongoose = require("mongoose"); 

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
router.get("/recent-users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }) // exclude admins
      .sort({ createdAt: -1 })                     // most recent first
      .limit(10)                                   // limit to recent 10 users
      .select("name email isOnline lastActive");   // select only required fields

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/like/:datasetId", verifyToken, isAdmin, async (req, res) => {
  try {
    const datasetId = new mongoose.Types.ObjectId(req.params.datasetId);
    const likes = await Like.find({ dataset: datasetId }).populate("user", "name email");
    res.json({
      totalLikes: likes.length,
      likedBy: likes.map((l) => ({
        user: l.user,
        createdAt: l.createdAt,
      })),
    });
    
  } catch (err) {
    res.status(500).json({ message: "Error fetching likes", error: err.message });
  }
});


router.get("/comment/:datasetId", verifyToken, isAdmin, async (req, res) => {
  console.log("Querying for dataset ObjectId:", req.params.datasetId);

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.datasetId)) {
      return res.status(400).json({ message: "Invalid dataset ID" });
    }

    const datasetId = new mongoose.Types.ObjectId(req.params.datasetId);
    
    const comments = await Comment.find({ dataset: datasetId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      totalComments: comments.length,
      comments: comments.map((c) => ({
        user: c.user,
        comment: c.comment, // 🔧 corrected
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error in /comment/:datasetId:", err);
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
});





router.get("/project/:projectId/stats", verifyToken, async (req, res) => {
  const { projectId } = req.params;

  try {
    const likeCount = await Like.countDocuments({ project: projectId });
    const commentCount = await Comment.countDocuments({ project: projectId });

    res.status(200).json({
      likes: likeCount,
      comments: commentCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project stats", error: err.message });
  }
});

// Get activity logs for a specific user (admin only)
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.params.userId })
      .populate("dataset", "title category")
      .sort({ timestamp: -1 });

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching activity", error: err.message });
  }
});

// Admin  to view user activity (login/logout + interactions)
router.get("/admin/user-activity/:userId", verifyToken, async (req, res) => {
  try {
    // Optional: Check if req.user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await ActivityLog.find({ user: req.params.userId })
      .populate("dataset", "title category")
      .sort({ timestamp: 1 });

    // Parse sessions
    const sessions = [];
    let currentSession = null;

    logs.forEach((log) => {
      const { action, dataset, timestamp } = log;

      if (action === "login") {
        currentSession = {
          loginTime: timestamp,
          logoutTime: null,
          durationMinutes: null,
          interactions: []
        };
      } else if (action === "logout" && currentSession) {
        currentSession.logoutTime = timestamp;
        currentSession.durationMinutes = Math.round(
          (timestamp - currentSession.loginTime) / 60000
        );
        sessions.push(currentSession);
        currentSession = null;
      } else if (currentSession) {
        currentSession.interactions.push({ action, dataset, timestamp });
      }
    });

    res.json({
      user: req.params.userId,
      totalSessions: sessions.length,
      sessions
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user activity", error: err.message });
  }
});

//all stats overview
router.get("/admin/stats", verifyToken, async (req, res) => {
  try {
    const datasetLikes = await Like.aggregate([
      { $match: { dataset: { $ne: null } } },
      { $group: { _id: "$dataset", count: { $sum: 1 } } }
    ]);

    const projectLikes = await Like.aggregate([
      { $match: { project: { $ne: null } } },
      { $group: { _id: "$project", count: { $sum: 1 } } }
    ]);

    const datasetComments = await Comment.aggregate([
      { $match: { dataset: { $ne: null } } },
      { $group: { _id: "$dataset", count: { $sum: 1 } } }
    ]);

    const projectComments = await Comment.aggregate([
      { $match: { project: { $ne: null } } },
      { $group: { _id: "$project", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      datasetLikes,
      projectLikes,
      datasetComments,
      projectComments,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all stats", error: err.message });
  }
});

module.exports = router;
