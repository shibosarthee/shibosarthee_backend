import admin from "../config/firebase.js";
export const testFirebase = async (req, res) => {
  try {
    const appName = admin.app().name;
    res.json({ message: "Firebase initialized", appName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};