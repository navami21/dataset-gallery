const express = require("express");
const router = express.Router();
const Comment = require("../model/commentData");
const { verifyToken, isUser, isAdmin } = require("../middleware/authMiddleware");

// POST: Add a comment to dataset (user only)
router.post("/:datasetId", verifyToken, isUser, async (req, res) => {
  const { datasetId } = req.params;
  const userId = req.user.id;
  const { comment } = req.body; // ✅ extract from body
  console.log("req.user:", req.user);
  console.log("Comment from body:", comment);

  try {
    const newComment = await Comment.create({
      user: userId,
      dataset: datasetId,
      comment,
    });
const populatedComment = await Comment.findById(newComment._id).populate("user", "name email");
res.status(201).json({ message: "Comment added", comment: populatedComment });

  } catch (err) {
    console.error("Error adding comment:", err); // helpful debug log
    res.status(500).json({ message: "Error adding comment", error: err });
  }
});

// POST: Toggle like (user only)


// GET: Get all comments for a dataset (any logged-in user)
router.get("/:datasetId", verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({ dataset: req.params.datasetId }).populate("user", "name email");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err });
  }
});

// GET: Admin-only – all comments in system
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const allComments = await Comment.find().populate("user dataset");
    res.status(200).json(allComments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all comments", error: err });
  }
});

module.exports = router;
