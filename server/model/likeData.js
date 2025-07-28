const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "dataset" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "alumniproject" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("like", likeSchema);
