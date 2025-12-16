import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  party: String,
  image: String,
  votes: { type: Number, default: 0 }
});

const electionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    candidates: [candidateSchema],

    electionInfo: {
      description: String,
      startTime: Date,
      endTime: Date
    },

    voters: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        candidateId: mongoose.Schema.Types.ObjectId
      }
    ],

    isActive: { type: Boolean, default: true },

    resultsLocked: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Election', electionSchema);
