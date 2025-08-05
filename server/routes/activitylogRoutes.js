const express = require("express");
const router = express.Router();
const ActivityLog = require("../model/activitylogData");
const { verifyToken, isUser, isAdmin } = require("../middleware/authMiddleware");
const { getLoginSessionsWithDuration } = require("../controller/activityController");

router.get("/sessions", verifyToken, isAdmin, getLoginSessionsWithDuration);

router.post("/addAccessedContent", verifyToken, isUser, async (req, res) => {
  const { action, datasetId } = req.body;
  const user = req.user.userId;

  try {
    await ActivityLog.create({
      user:user, 
      action: action || "viewed",
      dataset: datasetId || null,
    });

    res.status(200).json({ message: "Activity logged successfully." });
  } catch (err) {
    console.error("Error logging activity:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
