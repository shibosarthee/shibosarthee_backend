import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // appVersion: {
    //   type: String, // optional: to track app version (if applicable)
    //   trim: true,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
