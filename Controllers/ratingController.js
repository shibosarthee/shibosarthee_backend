import Rating from "../Models/Rating.js";
import User from "../Models/User.js";

// Add rating
export const addRating = async (req, res) => {
  try {
    //const userId = req.user._id; // get from middleware //uncomment if you take it from middleware
    const { userId, stars, feedback } = req.body;

    if (!userId || !stars)
      return res.status(400).json({ message: "userId and stars are required" });

    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optionally allow only one rating per user (uncomment if you want)
    // const existing = await Rating.findOne({ user: userId });
    // if (existing)
    //   return res.status(400).json({ message: "User already submitted feedback" });

    const rating = await Rating.create({
      user: userId,
      stars,
      feedback,
      
    });

    return res.status(201).json({
      message: "Thank you for your feedback!",
      rating,
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all ratings (for admin)
export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate("user", "name email");
    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get average rating
export const getAverageRating = async (req, res) => {
  try {
    const result = await Rating.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$stars" }, total: { $sum: 1 } } },
    ]);
    const avgRating = result[0]?.avgRating || 0;
    const total = result[0]?.total || 0;

    res.status(200).json({ avgRating, total });
  } catch (error) {
    console.error("Error calculating average:", error);
    res.status(500).json({ message: "Server error" });
  }
};