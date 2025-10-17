import admin from "../config/firebase.js";
/**
 * Send push notification via Firebase Cloud Messaging
 * @param {string} token - Device FCM token
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {object} [data] - Optional custom data payload
 */
export const sendNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: data,
      token,
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
};