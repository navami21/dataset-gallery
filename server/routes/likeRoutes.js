const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Like = require("../model/likeData");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");


//  Toggle like for dataset
router.post("/dataset/:datasetId", verifyToken, async (req, res) => {
  const { datasetId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(datasetId)) {
    return res.status(400).json({ message: "Invalid dataset ID" });
  }

  const existingLike = await Like.findOne({ user: req.user.userId, dataset: datasetId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
  } else {
    await Like.create({ user: req.user.userId, dataset: datasetId });
  }

  // Always return updated like count & status
  const totalLikes = await Like.countDocuments({ dataset: datasetId });
  const userLiked = await Like.exists({ user: req.user.userId, dataset: datasetId });

  res.json({
    message: existingLike ? "Dataset unliked" : "Dataset liked",
    liked: !!userLiked,
    totalLikes
  });
});

// Get dataset like status + count (works for all authenticated users)
router.get("/dataset/:datasetId/status", verifyToken, async (req, res) => {
  const { datasetId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(datasetId)) {
    return res.status(400).json({ message: "Invalid dataset ID" });
  }

  const totalLikes = await Like.countDocuments({ dataset: datasetId });
  const userLiked = await Like.exists({ user: req.user.userId, dataset: datasetId });

  res.json({
    liked: !!userLiked,
    totalLikes
  });
});

// Get all dataset likes with user info (Admin only)
router.get("/dataset/:datasetId", verifyToken, isAdmin, async (req, res) => {
  const { datasetId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(datasetId)) {
    return res.status(400).json({ message: "Invalid dataset ID" });
  }

  const likes = await Like.find({ dataset: datasetId }).populate("user", "name email");
  res.json({
    totalLikes: likes.length,
    likedBy: likes.map(l => ({
      name: l.user?.name || "Unknown",
      email: l.user?.email || "unknown@example.com",
      createdAt: l.createdAt
    }))
  });
});

//Project Likes
// Toggle like for project
router.post("/project/:projectId", verifyToken, async (req, res) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  const existingLike = await Like.findOne({ user: req.user.userId, project: projectId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
  } else {
    await Like.create({ user: req.user.userId, project: projectId });
  }

  // return updated like count & status
  const totalLikes = await Like.countDocuments({ project: projectId });
  const userLiked = await Like.exists({ user: req.user.userId, project: projectId });

  res.json({
    message: existingLike ? "Project unliked" : "Project liked",
    liked: !!userLiked,
    totalLikes
  });
});

//  Get all project likes with user info (Admin only)
router.get("/project/:projectId", verifyToken, isAdmin, async (req, res) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  const likes = await Like.find({ project: projectId }).populate("user", "name email");
  res.json({
    totalLikes: likes.length,
    likedBy: likes.map(l => ({
      name: l.user?.name || "Unknown",
      email: l.user?.email || "unknown@example.com",
      createdAt: l.createdAt
    }))
  });
});

// ✅ Get project like status + count (works for all authenticated users)
router.get("/project/:projectId/status", verifyToken, async (req, res) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  const totalLikes = await Like.countDocuments({ project: projectId });
  const userLiked = await Like.exists({ user: req.user.userId, project: projectId });

  res.json({
    liked: !!userLiked,
    totalLikes
  });
});

module.exports = router;
