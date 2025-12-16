import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper function for password validation (optional)
const isPasswordStrong = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // min 8 chars, 1 letter, 1 number
  return regex.test(password);
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Validate password strength
    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and contain at least 1 letter and 1 number",
      });
    }

    // Check if email or username exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(400).json({ msg: "Email or Username already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      fName: firstName,
      lName: lastName,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ msg: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
});

// Get User Profile (protected route)
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the decoded token

    // Find the user by ID and exclude password field
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user); // Return user profile
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
});

export default router;
