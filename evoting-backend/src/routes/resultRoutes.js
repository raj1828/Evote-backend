import express from 'express';
import Election from '../models/Election.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * LIVE RESULTS
 */
router.get('/:electionId/live-results', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId)
      .select('name candidates resultsLocked electionInfo');

    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }

    const totalVotes = election.candidates.reduce(
      (sum, c) => sum + c.votes,
      0
    );

    const results = election.candidates.map(candidate => ({
      _id: candidate._id,
      name: candidate.name,
      votes: candidate.votes,
      percentage: totalVotes
        ? ((candidate.votes / totalVotes) * 100).toFixed(2)
        : 0
    }));

    res.status(200).json({
      election: election.name,
      resultsLocked: election.resultsLocked,
      totalVotes,
      results
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
