import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
     
      
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },

    name: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    age: {
      type: Number,
      min: 18, // assuming matrimonial app requires minimum 18
      max: 100,
    },

    height: {
      type: Number, // height in cm
      min: 50,
      max: 250,
    },

    caste: {
      type: String, // caste is usually a string, not a number
      trim: true,
    },

    image: {
      type: String, // URL to image
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    education: {
      type: String,
      trim: true,
    },

    jobTitle: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    religion: {
      type: String,
      trim: true,
    },

    motherTongue: {
      type: String,
      trim: true,
    },

    aboutMe: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    email: { type: String, required: true, unique: true },
  

    // OTP fields
    otp: { type: String },
    otpExpiresAt: { type: Date },
// fcm token  to  send notification to user
fcmToken: String,  

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
