const mongoose = require("mongoose");

const alumniProjectSchema = new mongoose.Schema({
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "dataset" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category",required: true  },
  title: String,
  description: String,
  link: String, // repo link
  image: String, // image URL
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("alumniproject", alumniProjectSchema);
