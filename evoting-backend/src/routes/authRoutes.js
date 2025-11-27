import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User already exists" });

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ msg: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ msg: "Login success", token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
