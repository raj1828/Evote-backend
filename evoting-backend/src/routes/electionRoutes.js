import express from "express";
import mongoose from "mongoose";
import Election from "../models/Election.js";
import auth from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * CREATE election (ADMIN ONLY)
 */
router.post("/create", auth, adminOnly, async (req, res) => {
  try {
    const { name, candidates, electionInfo, isActive } = req.body;

    const election = new Election({
      name,
      candidates,
      electionInfo,
      isActive,
      createdBy: req.user.id,
    });

    await election.save();

    res.status(201).json({
      msg: "Election created successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * UPDATE election (ADMIN ONLY)
 */
router.put("/update/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid election ID" });
    }

    const updatedElection = await Election.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedElection) {
      return res.status(404).json({ msg: "Election not found" });
    }

    res.status(200).json({
      msg: "Election updated successfully",
      election: updatedElection,
    });
  } catch (error) {
    console.error("UPDATE ERROR 🔥:", error);
    res.status(500).json({
      msg: "Server error",
      error: error.message, // <-- add this line temporarily
      stack: error.stack, // <-- optional for debugging
    });
  }
});

/**
 * DELETE election (ADMIN ONLY)
 */
router.delete("/delete/:id", auth, adminOnly, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }

    await election.deleteOne();

    res.status(200).json({ msg: "Election deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET all elections (ADMIN ONLY)
 */
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.status(200).json({ elections });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET single election (ADMIN ONLY)
 */
router.get("/:id", auth, adminOnly, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }

    res.status(200).json({ election });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
