const express = require("express");
const router = express.Router();
const ContactMessage = require("../model/contactData");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

// User sends message (works for both guest + logged-in users)
router.post("/", async (req, res) => {
  try {
    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId || decoded.id || decoded._id;
      } catch (err) {
        console.warn("Invalid token. Treating as guest.");
      }
    }

    const { name, email, message } = req.body;
    const newMessage = new ContactMessage({ name, email, message, userId });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Admin gets all messages
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin replies to message
router.post("/reply/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { reply, status: "replied", repliedAt: Date.now() },
      { new: true }
    );
    res.json({ message: "Reply sent", data: message });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/mark-read", verifyToken, async (req, res) => {
  try {
    await ContactMessage.updateMany(
      { userId: req.user.userId, reply: { $ne: "" }, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// User gets their replies (notifications)
router.get("/my-messages", verifyToken, async (req, res) => {
  try {
    const messages = await ContactMessage
      .find({ userId: req.user.userId }) 
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
