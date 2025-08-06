

const express = require("express");
const router = express.Router();
const Comment = require("../model/commentData");
const { verifyToken, isUser } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");



// POST: Add comment to dataset (user only)
router.post("/:datasetId", verifyToken, isUser, async (req, res) => {
  const { datasetId } = req.params;
  const { comment } = req.body;
  const userId = req.user.userId || req.user.id;

  if (!mongoose.Types.ObjectId.isValid(datasetId)) {
    return res.status(400).json({ message: "Invalid dataset ID" });
  }

  try {
    const newComment = await Comment.create({
      user: userId,
      dataset: datasetId,
      comment,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "name email");

    res.status(201).json({ message: "Comment added", comment: populatedComment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Error adding comment", error: err });
  }
});

// GET: Get all comments for a dataset (any logged-in user)
router.get("/:datasetId", verifyToken, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.datasetId)) {
    return res.status(400).json({ message: "Invalid dataset ID" });
  }

  try {
    const comments = await Comment.find({ dataset: req.params.datasetId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err });
  }
});


// POST: Add comment to project (user only)
router.post("/project/:projectId", verifyToken, isUser, async (req, res) => {
  const { projectId } = req.params;
  const { comment } = req.body;
  const userId = req.user.userId || req.user.id;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const newComment = await Comment.create({
      user: userId,
      project: projectId,
      comment,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "name email");

    res.status(201).json({ message: "Comment added", comment: populatedComment });
  } catch (err) {
    console.error("Error adding project comment:", err);
    res.status(500).json({ message: "Error adding project comment", error: err });
  }
});

// GET: Get all comments for a project (any logged-in user)
router.get("/project/:projectId", verifyToken, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const comments = await Comment.find({ project: req.params.projectId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project comments", error: err });
  }
});

module.exports = router;
