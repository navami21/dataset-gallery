const mongoose = require("mongoose");

const alumniProjectSchema = new mongoose.Schema({
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "Dataset" },
  title: String,
  description: String,
  link: String, // repo liink
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("alumniproject", alumniProjectSchema);
