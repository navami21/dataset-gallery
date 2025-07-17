const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "Dataset" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("like", likeSchema);
