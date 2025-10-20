import Favorite from "../Models/Favorite.js";
import Profile from "../Models/Profilemodel.js";

// Add a profile to favorites
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({ success: false, message: "profileId is required" });
    }

    // Check profile exists
    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    // Create favorite if not exists
    const favorite = new Favorite({ user: userId, profile: profileId });
    await favorite.save();

    return res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    // Unique index violation -> already favorited
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Already in favorites" });
    }
    console.error("addFavorite error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Remove a profile from favorites
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileId } = req.params;

    const removed = await Favorite.findOneAndDelete({ user: userId, profile: profileId });
    if (!removed) return res.status(404).json({ success: false, message: "Favorite not found" });

    return res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    console.error("removeFavorite error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all favorites for the authenticated user
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('profile');

    return res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    console.error("getFavorites error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
