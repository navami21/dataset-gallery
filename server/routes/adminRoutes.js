// routes/adminUpload
const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");
const User = require("../model/userData");
const { sendPasswordEmail } = require("../utils/emailSender"); 
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
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
router.post("/upload-users", verifyToken, isAdmin, async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "No emails provided" });
    }

    const success = [];
    const exists = [];
    const failed = [];

    for (const email of emails) {
      try {
        const userExists = await User.findOne({ email });
        if (userExists) {
          exists.push(email);
          continue;
        }

        const rawPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const newUser = new User({
          name: email.split("@")[0],
          email,
          password: hashedPassword,
          role: "user",
        });

        await newUser.save();
        await sendPasswordEmail(email, rawPassword); // assumes email sending is async

        success.push(email);

      } catch (err) {
        console.error("Failed for ${email}:", err.message);
        failed.push(email);
      }
    }

    res.status(200).json({
      message: "Upload complete",
      success,
      exists,
      failed,
    });

  } catch (err) {
    console.error(" Server error during upload:", err.message);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});


// Update lastActive for logged-in user
router.post("/heartbeat", verifyToken, async (req, res) => {
  try {
    // Always ensure we get the right user ID from JWT payload
    const userId = req.user.id || req.user.userId || req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    await User.findByIdAndUpdate(userId, {
      lastActive: new Date()
    });

    res.status(200).json({ message: "Heartbeat recorded" });
  } catch (err) {
    console.error("Error updating heartbeat:", err);
    res.status(500).json({ message: "Failed to update heartbeat" });
  }
});


router.get("/recent-users", verifyToken, isAdmin, async (req, res) => {
  try {
    const now = Date.now();
    const users = await User.find({ role: { $ne: "admin" } }) // exclude admins
      .sort({ lastLogin: -1 })
      .limit(10)
      .select("name email lastLogin lastLogout lastActive");

    const updatedUsers = users.map(u => {
      const hasRecentHeartbeat =
        u.lastActive && (now - new Date(u.lastActive).getTime()) < 60 * 1000;

      const notLoggedOut =
        !u.lastLogout || new Date(u.lastLogout) <= new Date(u.lastLogin);

      return {
        ...u.toObject(),
        isOnline: hasRecentHeartbeat && notLoggedOut
      };
    });

    res.json(updatedUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent users" });
  }
});



router.get("/all-user-activity", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      action: { $in: ["login", "logout"] }
    })
      .populate({
        path: "user",
        match: { role: { $ne: "admin" } },
        select: "name email role"
      })
      .sort({ timestamp: -1 });

    const userMap = {};

    logs.forEach(log => {
      if (!log.user) return;
      const uid = log.user._id.toString();

      if (!userMap[uid]) {
        userMap[uid] = {
          user: log.user,
          lastLogin: null,
          lastLogout: null
        };
      }

      if (log.action === "login" && !userMap[uid].lastLogin) {
        userMap[uid].lastLogin = log.timestamp;
      }

      if (log.action === "logout" && !userMap[uid].lastLogout) {
        userMap[uid].lastLogout = log.timestamp;
      }
    });

    res.json(Object.values(userMap));
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user-activity/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await ActivityLog.find({ user: req.params.userId })
      .populate("dataset", "title category")
      .sort({ timestamp: 1 });

    const sessions = [];
    let currentSession = null;

    logs.forEach(log => {
      const { action, dataset, timestamp } = log;

      if (action === "login") {
        currentSession = {
          loginTime: timestamp,
          logoutTime: null,
          durationMinutes: null,
          interactions: []
        };
      } 
      else if (action === "logout" && currentSession) {
        currentSession.logoutTime = timestamp;
        currentSession.durationMinutes = Math.round(
          (timestamp - currentSession.loginTime) / 60000
        );
        sessions.push(currentSession);
        currentSession = null;
      } 
      else if (currentSession) {
        currentSession.interactions.push({
          action,
          dataset: dataset ? dataset.title : null,
          timestamp
        });
      }
    });

    //  Push active session without logout
    if (currentSession) {
      currentSession.logoutTime = null;
      currentSession.durationMinutes = Math.round(
        (Date.now() - currentSession.loginTime) / 60000
      );
      sessions.push(currentSession);
    }

    //  return all raw actions for quick view
    const allActions = logs.map(l => ({
      action: l.action,
      dataset: l.dataset ? l.dataset.title : null,
      timestamp: l.timestamp
    }));

    res.json({
      user: req.params.userId,
      totalSessions: sessions.length,
      sessions,
      allActions
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user activity", error: err.message });
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

const getLoginSessionsWithDuration = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ action: { $in: ["login", "logout"] } })
      .populate("user", "name email")
      .sort({ timestamp: 1 });

    const userSessions = {}; 

    logs.forEach(log => {
      const userId = log.user._id.toString();

      if (!userSessions[userId]) userSessions[userId] = [];

      if (log.action === "login") {
        userSessions[userId].push({ login: log.timestamp, logout: null });
      } else if (log.action === "logout") {
        const session = userSessions[userId].find(s => !s.logout);
        if (session) session.logout = log.timestamp;
      }
    });

    // Convert to summary list
    const sessionSummary = [];

    for (const userId in userSessions) {
      const user = logs.find(log => log.user._id.toString() === userId)?.user;

      userSessions[userId].forEach((session, index) => {
        if (session.logout) {
          const durationMs = new Date(session.logout) - new Date(session.login);
          sessionSummary.push({
            name: user.name,
            email: user.email,
            login: session.login,
            logout: session.logout,
            duration: Math.round(durationMs / 1000) + "s"
          });
        }
      });
    }

    res.json(sessionSummary);
  } catch (error) {
    console.error("Error computing sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};




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
// preview-users (no email sent, only parsing Excel)
router.post("/preview-users", verifyToken, isAdmin, upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(sheet);

    // return names & emails
    const userPreviews = users.map((u) => ({
      name: u.name,
      email: u.email,
    }));

    res.status(200).json({ users: userPreviews });
  } catch (err) {
    res.status(500).json({ message: "Preview failed", error: err.message });
  }
});

// Admin  to view user activity (login/logout + interactions)
router.get("/admin/user-activity/:userId", verifyToken,isAdmin, async (req, res) => {
    console.log("Fetching activity for user:", req.params.userId);

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


  //contact page route
const ContactMessage = require("../model/contactMessage");

router.get("/contact-messages", verifyToken, isAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
});
const { sendReplyEmail } = require("../utils/emailSender");

router.put("/contact-messages/:id/reply", verifyToken, isAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await ContactMessage.findById(req.params.id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    message.reply = reply;
    await message.save();

    if (!message.userId) {
      await sendReplyEmail(message.email, message.name, reply);
    }

    res.status(200).json({ message: "Reply sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reply", error: err.message });
  }
});


});

module.exports = router;
