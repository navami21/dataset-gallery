// models/contactMessage.js
const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Optional for logged-in users
  name: String,
  email: String,
  message: String,
  reply: { type: String, default: "" },
  status: { type: String, default: "pending" }, // pending, replied
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  repliedAt: Date
});

module.exports = mongoose.model("Contact", contactMessageSchema);
