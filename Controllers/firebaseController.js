import admin from "../config/firebase.js";
import User from "../Models/User.js";
export const testFirebase = async (req, res) => {
  try {
    const appName = admin.app().name;
    res.json({ message: "Firebase initialized", appName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const updateFcmToken = async (req, res) => {
  try {
    const userId = req.user.id; // auto from token
    const {fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({
        success: false,
        message: "userId and fcmToken are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true } // return updated document
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FCM Token updated successfully",
      data: user,
    });

  } catch (error) {
    console.error("❌ Error updating FCM token:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};