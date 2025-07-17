const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Dataset = require("../model/datasetData");
const fs = require("fs");
const csvParser = require("csv-parser");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");


// Multer Setup 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") cb(null, "uploads/images");
    else if (file.fieldname === "csv") cb(null, "uploads/csvs");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Add Dataset
router.post(
  "/add",verifyToken,isAdmin,upload.fields([
    { name: "image", maxCount: 1 },
    { name: "csv", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category, videos, uploadedBy } = req.body;

      const image = req.files?.image?.[0];
      const csv = req.files?.csv?.[0];

      let columnHeaders = [];

      if (csv) {
        const filePath = csv.path;

        // Parse the CSV to get column headers
        const parser = fs
          .createReadStream(filePath)
          .pipe(csvParser());

        // Get column headers from the first row only
        const headers = await new Promise((resolve, reject) => {
          parser.on("headers", (headers) => {
            resolve(headers);
            parser.destroy(); // stop reading after first row
          });
          parser.on("error", reject);
        });

        columnHeaders = headers;
      }

      const newDataset = new Dataset({
        title,
        description,
        category,
        columns: columnHeaders,
        columnCount: columnHeaders.length,
        videos: videos ? JSON.parse(videos) : [],
        uploadedBy,
        imageUrl: image ? `/uploads/images/${image.filename}` : "",
        csvUrl: csv ? `/uploads/csvs/${csv.filename}` : "",
        size: csv ? (csv.size / 1024).toFixed(2) + " KB" : "",
      });

      await newDataset.save();
      res.status(201).json({ message: "Dataset added", dataset: newDataset });
    } catch (error) {
      console.error("Add Dataset Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get All Datasets
router.get("/", verifyToken,async (req, res) => {
  try {
    const datasets = await Dataset.find().populate("category").sort({ createdAt: -1 });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Dataset by ID
router.get("/:id",verifyToken, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id).populate("category");
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Datasets by Category
router.get("/category/:categoryId", verifyToken,async (req, res) => {
  try {
    const datasets = await Dataset.find({ category: req.params.categoryId });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



//Update Dataset
router.put(
  "/edit/:id",isAdmin,verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "csv", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updates = req.body;
      const image = req.files?.image?.[0];
      const csv = req.files?.csv?.[0];

      if (image) updates.imageUrl = `/uploads/images/${image.filename}`;
      if (csv) {
        updates.csvUrl = `/uploads/csvs/${csv.filename}`;
        updates.size = (csv.size / 1024).toFixed(2) + " KB";
      }
      if (updates.columns) updates.columns = JSON.parse(updates.columns);
      if (updates.videos) updates.videos = JSON.parse(updates.videos);

      const updated = await Dataset.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      res.json({ message: "Dataset updated", dataset: updated });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
//Delete Dataset
router.delete("/:id",isAdmin,verifyToken, async (req, res) => {
    try {
      await Dataset.findByIdAndDelete(req.params.id);
      res.json({ message: "Dataset deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
module.exports = router;
