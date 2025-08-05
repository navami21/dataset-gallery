const mongoose = require("mongoose");

const alumniProjectSchema = new mongoose.Schema({
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "dataset" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category",required: true  },
  title: String,
  description: String,
  link: String, // repo link
  image: {
    type: [String], // change from String to array of Strings
    default: [],    // optional: default to empty array if no images uploaded
  },
  report: { type: String },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("alumniproject", alumniProjectSchema);
