import { sendNotification } from "../Utils/sendNotification.js";
/**
 * Example: Send notification to a specific user
 */
export const sendTestNotification = async (req, res) => {
  try {
    const { fcmToken, title, body } = req.body;

    if (!fcmToken) return res.status(400).json({ message: "fcmToken is required" });

    const result = await sendNotification(
      fcmToken,
      title || "Matrimony App",
      body || "This is a test notification"
    );

    res.json({ message: "Notification sent successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
};
