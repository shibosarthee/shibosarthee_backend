import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // user who sends the request
    },
    senderProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true, // profile used to send request
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // user who owns the profile being requested
    },
    receiverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true, // profile that received the request
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
