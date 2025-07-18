const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const AlumniProject = require("../model/projectData");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Multer config for image upload (png, jpg only)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/alumni";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only PNG and JPG images are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

// CREATE - Add new alumni project (Admin only)
router.post("/add", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { dataset, title, description, link } = req.body;

    const newProject = new AlumniProject({
      dataset,
      title,
      description,
      link,
      image: req.file ? `/uploads/alumni/${req.file.filename}` : null,
      addedBy: req.user.userId,
    });

    await newProject.save();
    res.status(201).json({ message: "Alumni project added successfully.", project: newProject });
  } catch (err) {
    res.status(500).json({ message: "Failed to add project", error: err.message });
  }
});

// READ - Get all projects (optionally filtered by dataset)
router.get("/", verifyToken, async (req, res) => {
    try {
      const filter = req.query.dataset ? { dataset: req.query.dataset } : {};
  
      const projects = await AlumniProject.find(filter)
        .populate({
          path: "dataset",
          populate: { path: "category", select: "name" }, // Only get category name
          select: "title category" // Only get dataset title & category ref
        });
  
      // Format and sanitize response
      const result = projects.map(project => {
        const { addedBy, ...rest } = project.toObject();
        return {
          ...rest,
          dataset: {
            title: project.dataset?.title || "Untitled Dataset",
            category: project.dataset?.category?.name || "Uncategorized"
          }
        };
      });
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch projects", error: err.message });
    }
  });
  

// UPDATE - Admin can update a project (with optional image change)
router.put("/:id", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const updateData = { title, description, link };

    if (req.file) {
      updateData.image = `/uploads/alumni/${req.file.filename}`;
    }

    const updated = await AlumniProject.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Project updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
});

// DELETE - Admin can delete a project
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const project = await AlumniProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Optional: delete associated image file
    if (project.image) {
      const imagePath = path.join(__dirname, "..", project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await AlumniProject.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
});

module.exports = router;
