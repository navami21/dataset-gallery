
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Like = require("../model/likeData");
const Comment = require("../model/commentData");

const AlumniProject = require("../model/projectData");
const { isAdmin,verifyToken } = require("../middleware/authMiddleware");

// Multer setup
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
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) cb(null, true);
  else cb(new Error("Only image and document files are allowed!"));
};

const upload = multer({ storage, fileFilter });
const multipleUpload = upload.fields([
  { name: "image", maxCount: 5 },
  { name: "report", maxCount: 1 },
]);

// Get projects by dataset ID
const mongoose = require("mongoose");

router.get("/dataset/:datasetId", verifyToken, async (req, res) => {
  const { datasetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(datasetId)) {
    return res.status(400).json({ message: "Invalid dataset ID format" });
  }

  try {
    const projects = await AlumniProject.find({ dataset: datasetId }).populate("dataset");

    if (!projects.length) {
       return res.json({ projects: [] });
    }

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
// ✅ GET single project by ID (used in ProjectDetails.jsx)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const project = await AlumniProject.findById(req.params.id)
      .populate("dataset", "title category")
      .lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch likes and comments from DB
    const likes = await Like.find({ project: req.params.id }).populate("user", "name email");
    const comments = await Comment.find({ project: req.params.id }).populate("user", "name email");

   res.json({
  project,
  likes: likes.map((l) => ({ userEmail: l.user.email })),
  comments: comments.map((c) => ({
    text: c.comment,
    user: {
      name: c.user.name,
      email: c.user.email,
    }
  })),
  role: req.user.role,
});

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Add alumni project
router.post("/add", verifyToken, isAdmin, multipleUpload, async (req, res) => {
  try {
    const { dataset, title, description, link, category } = req.body;

    const newProject = new AlumniProject({
      dataset,
      title,
      description,
      link,
      category,
      image: req.files?.image
      ? req.files.image.map((file) => `/uploads/alumni/${file.filename}`)
      : [],
      report: req.files?.report ? `/uploads/alumni/${req.files.report[0].filename}` : null,
      addedBy: req.user.userId,
    });

    await newProject.save();
    res.status(201).json({ message: "Alumni project added successfully", project: newProject });
  } catch (error) {
    res.status(500).json({ error: "Failed to add project", details: error.message });
  }
});

// Delete alumni project
// router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
//   try {
//     const project = await AlumniProject.findById(req.params.id);
//     if (!project) return res.status(404).json({ error: "Project not found" });

//     // Delete image
//     if (project.image) {
//       const imagePath = path.join(__dirname, "..", project.image);
//       if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
//     }

//     // Delete report
//     if (project.report) {
//       const reportPath = path.join(__dirname, "..", project.report);
//       if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);
//     }

//     await AlumniProject.findByIdAndDelete(req.params.id);
//     res.json({ message: "Project deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete project", details: error.message });
//   }
// });
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await AlumniProject.find().populate("dataset", "title category");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
});
router.put("/:id", verifyToken, isAdmin, multipleUpload, async (req, res) => {
  try {
    const { title, description, link, category, dataset } = req.body;
    const updateData = {
      title,
      description,
      link,
      category,
      dataset,
    };

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

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const project = await AlumniProject.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Delete image(s)
    if (Array.isArray(project.image)) {
      project.image.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // Delete report
    if (project.report) {
      const reportPath = path.join(__dirname, "..", project.report);
      if (fs.existsSync(reportPath)) fs.unlinkSync(reportPath);
    }

    await AlumniProject.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error); // Log for debugging
    res.status(500).json({ error: "Failed to delete project", details: error.message });
  }
});

router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const existingLike = await Like.findOne({
      user: req.user.userId,
      project: req.params.id,
    });

    if (existingLike) {
      return res.status(400).json({ message: "You already liked this project" });
    }

    const like = new Like({
      user: req.user.userId,
      project: req.params.id,
    });

    await like.save();
    res.status(201).json({ message: "Project liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error liking project", error: error.message });
  }
});

// Comment on a project
// Comment on a project
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

    // ✅ Populate user before sending response
    const populatedComment = await Comment.findById(newComment._id).populate("user", "name email");

    res.status(201).json({ message: "Comment added", comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
});

module.exports = router;
