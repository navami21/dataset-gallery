
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const Like = require("../model/likeData");
const Comment = require("../model/commentData");
const AlumniProject = require("../model/projectData");
const { isAdmin, verifyToken } = require("../middleware/authMiddleware");

// Multer Setup 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/alumni/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});
const fileFilter = (req, file, cb) => {
  // Allowed extensions & mime types
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image and document files are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });
const multipleUpload = upload.fields([
  { name: "image", maxCount: 5 },
  { name: "report", maxCount: 1 },
]);

// Get all projects
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await AlumniProject.find().populate("dataset");
    res.json(projects);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all projects for a dataset
router.get("/dataset/:datasetId", verifyToken, async (req, res) => {
  const { datasetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(datasetId)) {
    return res.status(400).json({ message: "Invalid dataset ID format" });
  }

  try {
    const projects = await AlumniProject.find({ dataset: datasetId }).populate("dataset");
    res.json({ projects });
  } catch (error) {
    console.error("Error fetching dataset projects:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});



router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid project ID format" });
  }

  try {
    const project = await AlumniProject.findById(id)
      .populate("dataset", "title category")
      .lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const likes = await Like.find({ project: id }).populate("user", "name email");
    const comments = await Comment.find({ project: id }).populate("user", "name email");

    res.json({
      project,
      likes: likes.map((l) => ({ userEmail: l.user?.email || "Unknown User" })),
      comments: comments.map((c) => ({
        text: c.comment,
        user: {
          name: c.user?.name || "Unknown",
          email: c.user?.email || "unknown@example.com",
        },
      })),
      role: req.user?.role || "user",
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Add project
router.post("/add", verifyToken, isAdmin, multipleUpload, async (req, res) => {
  try {
    const { dataset, title, description, link, category } = req.body;

    const newProject = new AlumniProject({
      dataset,
      title,
      description,
      link,
      category,
      docxUrl: docxUrl || null,
      image: req.files?.image
        ? req.files.image.map((file) => `/uploads/alumni/${file.filename}`)
        : [],
      report: req.files?.report ? `/uploads/alumni/${req.files.report[0].filename}` : null,
      addedBy: req.user.userId,
    });

    await newProject.save();
    res.status(201).json({ message: "Alumni project added successfully", project: newProject });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ error: "Failed to add project", details: error.message });
  }
});

//  Update project
router.put("/:id", verifyToken, isAdmin, multipleUpload, async (req, res) => {
  try {
    const { title, description, link, category, dataset } = req.body;
    const updateData = { title, description, link, category, dataset };
      if (docxUrl) updateData.docxUrl = docxUrl; 

    if (req.files?.image) {
      updateData.image = req.files.image.map((file) => `/uploads/alumni/${file.filename}`);
    }
    if (req.files?.report) {
      updateData.report = `/uploads/alumni/${req.files.report[0].filename}`;
    }

    const updated = await AlumniProject.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Project updated", updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
});

//  Delete project
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const project = await AlumniProject.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (Array.isArray(project.image)) {
      project.image.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }
    if (project.report) {
      const reportPath = path.join(__dirname, "..", project.report);
      if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);
    }

    await AlumniProject.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete project", details: error.message });
  }
});

// Toggle like for project
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const existingLike = await Like.findOne({
      user: req.user.userId,
      project: req.params.id,
    });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      return res.json({ message: "Project unliked successfully", liked: false });
    }

    // Like
    const like = new Like({
      user: req.user.userId,
      project: req.params.id,
    });
    await like.save();

    res.status(201).json({ message: "Project liked successfully", liked: true });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
});

//  Comment on project
router.post("/:id/comment", verifyToken, async (req, res) => {
  const { comment } = req.body;
  if (!comment?.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  try {
    const newComment = new Comment({
      user: req.user.userId,
      project: req.params.id,
      comment,
    });

    await newComment.save();
    const populatedComment = await Comment.findById(newComment._id).populate("user", "name email");

    res.status(201).json({ message: "Comment added", comment: populatedComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
});

module.exports = router;
