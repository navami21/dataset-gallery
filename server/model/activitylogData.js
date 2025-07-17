const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String, // e.g. "login", "viewed dataset", "liked", "uploaded"
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "Dataset", default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("activityLog", activityLogSchema);
