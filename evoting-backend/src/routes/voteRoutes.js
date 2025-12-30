import express from "express";
import Election from "../models/Election.js";

const router = express.Router();

/**
 * VOTE in an election (NO AUTH)
 */
router.post("/:electionId/vote", async (req, res) => {
  try {
    const { candidateId } = req.body;
    const { electionId } = req.params;

    // Validate input
    if (!candidateId) {
      return res.status(400).json({ msg: "candidateId is required" });
    }

    // Find election
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }

    // Check if election is active
    if (!election.isActive) {
      return res.status(400).json({ msg: "Election is not active" });
    }

    // Check election end time
    const now = new Date();
    if (election.electionInfo?.endTime && now > election.electionInfo.endTime) {
      election.isActive = false;
      election.resultsLocked = true;
      await election.save();

      return res.status(400).json({
        msg: "Election has ended. Voting is closed",
      });
    }

    // Check results lock
    if (election.resultsLocked) {
      return res.status(400).json({
        msg: "Results are locked. Voting not allowed",
      });
    }

    // Find candidate
    const candidate = election.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    // Increment vote
    candidate.votes += 1;

    await election.save();

    res.status(200).json({
      msg: "Vote cast successfully",
      candidate: {
        _id: candidate._id,
        name: candidate.name,
        votes: candidate.votes,
      },
    });
  } catch (error) {
    console.error("VOTE ERROR 👉", error);
    res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
});

export default router;
