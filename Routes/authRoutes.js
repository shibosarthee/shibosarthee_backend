import express from "express";
import { sendOtp, verifyOtp } from "../Controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp); // Send OTP
router.post("/verify-otp", verifyOtp); // Verify OTP

export default router;
