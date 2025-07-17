const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userData");  
const { verifyToken } = require("../middleware/authMiddleware"); 

// Admin Registration 
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checks if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

// Login (for both admin & users)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Find the user first
    const user = await User.findById(req.user.userId);
    console.log("Logged in user ID:", req.userId);
    console.log("Found user email:", user.email);

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("currentPassword from user:", currentPassword);
    console.log("user.password from DB:", user.password);
    console.log("Does password match:", await bcrypt.compare(currentPassword.trim(), user.password));

    // Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword.trim(), user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
});


module.exports = router;
