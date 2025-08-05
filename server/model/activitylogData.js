const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  action: {
    type: String,
    enum: ["login", "logout", "viewed", "liked", "uploaded", "downloaded"],
    required: true
  },
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: "dataset", default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
