const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "dataset" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "alumniproject" },

  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("comment", commentSchema);
