import User from "../Models/User.js";
import generateToken from "../Utils/generateToken.js";
import axios from "axios";
import sendEmail from "../Utils/mailer.js";
/**
 * Send OTP via Email
 */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.isVerified = false;
    await user.save();

    // Send OTP via email
    await sendEmail(
      email,
     "Your ShiboSarthee Login OTP",
  `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #f9fafb; text-align: center; padding: 20px;">
      <img src="https://healcure.ca/assets/logo-Bwud1c4U.png" alt="Healcure" style="width: 120px; margin-bottom: 10px;" />
      <h2 style="color: #333;">Login Verification</h2>
    </div>

    <div style="padding: 20px; color: #333;">
      <p>Dear User,</p>
      <p>Thank you for choosing <strong>Healcure</strong>. Please use the following One-Time Password (OTP) to complete your login:</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #1E88E5;">${otp}</span>
      </div>
      
      <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p>If you didn’t request this, please ignore this email or contact our support team immediately.</p>
      
      <p style="margin-top: 30px;">Best regards,<br /><strong>The Healcure Team</strong></p>
    </div>

    <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
      <p>© ${new Date().getFullYear()} Healcure. All rights reserved.</p>
    </div>
  </div>
  `
    );

    res.json({ message: "OTP sent successfully to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify OTP via Email
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, fcmToken } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email & OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Validate OTP
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // Mark user verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    if (fcmToken) user.fcmToken = fcmToken;

    await user.save();

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: error.message });
  }
};