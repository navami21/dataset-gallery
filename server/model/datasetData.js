const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  imageUrl: String, // dataset thumbnail or cover
  csvUrl: String,   // uploaded CSV file path or link
  size: String,     // "12KB", "1.3MB" etc.
  columns: [String], // extracted from CSV headers
  videos: [String], // optional video links
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("dataset", datasetSchema);
