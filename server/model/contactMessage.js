const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  reply: {
    type: String,
    default: null,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
