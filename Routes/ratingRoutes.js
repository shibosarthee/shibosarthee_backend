import express from 'express';
import { addRating,getAllRatings,getAverageRating } from '../Controllers/ratingController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();


// POST: Add rating
router.post("/add",protect, addRating);   //add middleware if you want to get user from token

// GET: Fetch all ratings (admin)
router.get("/all", getAllRatings);

// GET: Get average rating
router.get("/average", getAverageRating);

export default router;