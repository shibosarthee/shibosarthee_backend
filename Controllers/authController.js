import { sendEmail } from "../services/emailService.js";
import User from "../Models/User.js";
import generateToken from "../Utils/generateToken.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let otp;

    // BYPASS: Default OTP for specific email
    if (email === "shibotest@gmail.com") {
      otp = 999999; // default OTP
    } else {
      otp = Math.floor(100000 + Math.random() * 900000);
    }

    const htmlContent = `
      <h2>Your OTP Code</h2>
      <p>Use this code to verify your email:</p>
      <h1>${otp}</h1>
      <p>This code will expire in 5 minutes.</p>
    `;

    await sendEmail(email, "Your OTP Code", htmlContent);

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        otp,
        otpExpiresAt: Date.now() + 5 * 60 * 1000,
      });
    } else {
      user.otp = otp;
      user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
      await user.save();
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, fcmToken } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // BYPASS: Default OTP for testing account
  if (email === "shibotest@gmail.com" && otp == 999999) {
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({
      message: "Login successful (BYPASSED)",
      token: generateToken(user._id),
      user,
    });
  }

  // Normal OTP validation
  if (user.otp !== otp || Date.now() > user.otpExpiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  res.json({
    message: "Login successful",
    token: generateToken(user._id),
    user,
  });
};
