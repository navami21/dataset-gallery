const express = require("express");
const router = express.Router();
const Like = require("../model/likeData");
const { verifyToken, isUser, isAdmin } = require("../middleware/authMiddleware");

// POST: Like a dataset (user only)
router.post("/:datasetId", verifyToken, isUser, async (req, res) => {
  const { datasetId } = req.params;
  const userId = req.user.id;

  try {
    // Check if already liked
    const existing = await Like.findOne({ user: userId, dataset: datasetId });
    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      return res.status(200).json({ message: "Unliked successfully" });
    }

    // If not liked, create new like
    const like = await Like.create({ user: userId, dataset: datasetId });
    res.status(201).json({ message: "Liked successfully", like });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err });
  }
});

// GET: Get all likes for a dataset (any logged-in user)
router.get("/:datasetId", verifyToken, async (req, res) => {
  try {
    const likes = await Like.find({ dataset: req.params.datasetId }).populate("user", "email");
    res.status(200).json(likes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching likes", error: err });
  }
});

// GET: Admin-only – all likes in system
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const allLikes = await Like.find().populate("user dataset");
    res.status(200).json(allLikes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all likes", error: err });
  }
});

module.exports = router;
