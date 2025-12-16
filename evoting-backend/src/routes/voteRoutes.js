import express from "express";
import Election from "../models/Election.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * VOTE in an election
 */
router.post("/:electionId/vote", auth, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const { electionId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ msg: "Election not found" });
    }

    if (!election.isActive) {
      return res.status(400).json({ msg: "Election is not active" });
    }

    // Check election time
    const now = new Date();

    if (election.electionInfo?.endTime && now > election.electionInfo.endTime) {
      election.isActive = false;
      election.resultsLocked = true;
      await election.save();

      return res.status(400).json({
        msg: "Election has ended. Voting is closed.",
      });
    }

    if (election.resultsLocked) {
      return res.status(400).json({
        msg: "Results are locked. Voting not allowed.",
      });
    }
    // Check if user already voted
    const alreadyVoted = election.voters.find(
      (v) => v.user.toString() === req.user.id
    );

    if (alreadyVoted) {
      return res.status(400).json({ msg: "You have already voted" });
    }

    // Find candidate
    const candidate = election.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    // Increment vote
    candidate.votes += 1;

    // Store voter record
    election.voters.push({
      user: req.user.id,
      candidateId,
    });

    await election.save();

    res.status(200).json({
      msg: "Vote cast successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error, please try again later" });
  }
});

export default router;
