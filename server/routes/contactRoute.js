const express = require("express");
const router = express.Router();
const ContactMessage = require("../model/contactMessage");
const { verifyToken } = require("../middleware/authMiddleware");

// Anyone can send message (optional login)
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;

    const contact = new ContactMessage({
      name,
      email,
      message,
      userId: userId || null,
    });

    await contact.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
});

module.exports = router;
