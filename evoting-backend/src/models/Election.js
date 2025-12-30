import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  party: String,
  image: String,
  votes: { type: Number, default: 0 },
});

const electionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    candidates: [candidateSchema],

    electionInfo: {
      description: String,
      startTime: String,
      endTime: String,
    },

    voters: [
      {
        user: mongoose.Schema.Types.ObjectId,
        candidateId: mongoose.Schema.Types.ObjectId,
      },
    ],

    isActive: { type: Boolean, default: true },

    resultsLocked: { type: Boolean, default: false },

    createdBy: String,
  },
  { timestamps: true }
);

// 🔥 THIS LINE PREVENTS OLD SCHEMA CACHE ISSUES
export default mongoose.models.Election ||
  mongoose.model("Election", electionSchema);
