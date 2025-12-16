import mongoose from "mongoose";

const userSchemna = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin : {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchemna);
