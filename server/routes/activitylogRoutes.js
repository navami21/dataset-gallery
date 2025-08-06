const express = require("express");
const router = express.Router();
const ActivityLog = require("../model/activitylogData");
const { verifyToken, isUser, isAdmin } = require("../middleware/authMiddleware");
const { getLoginSessionsWithDuration } = require("../controller/activityController");

router.get("/sessions", verifyToken, isAdmin, getLoginSessionsWithDuration);

// Log user activity
router.post("/addAccessedContent", verifyToken, async (req, res) => {
  try {
    const { action, datasetId } = req.body;
    const log = new ActivityLog({
      user: req.user.userId,
      action,
      datasetId
    });
    await log.save();
    res.json({ message: "Activity logged" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
