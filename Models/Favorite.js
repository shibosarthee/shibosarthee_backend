import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can favorite a profile only once
favoriteSchema.index({ user: 1, profile: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
