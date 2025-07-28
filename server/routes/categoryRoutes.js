const express = require("express");
const router = express.Router();
const Category = require("../model/categoryData");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Add Category
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, description, imageUrl });
    await newCategory.save();

    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (err) {
    res.status(500).json({ message: "Error adding category", error: err.message });
  }
});

// View All Categories
router.get("/all",verifyToken, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
});
// edit category
router.put("/edit/:id", verifyToken, isAdmin, async (req, res) => {
    try {
      const { name, description, imageUrl } = req.body;
      const updated = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description, imageUrl },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Category not found" });
  
      res.status(200).json({ message: "Category updated", category: updated });
    } catch (err) {
      res.status(500).json({ message: "Update failed", error: err.message });
    }
  });
  // DELETE category
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
    try {
      const deleted = await Category.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Category not found" });
  
      res.status(200).json({ message: "Category deleted" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed", error: err.message });
    }
  });

router.get("/category-count", verifyToken, isAdmin, async (req, res) => {
  console.log("GET /category-count route hit"); 
  try {
    const count = await Category.countDocuments();
    
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching category count" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    console.error("Fetch category error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
