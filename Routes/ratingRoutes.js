import express from 'express';
import { addRating,getAllRatings,getAverageRating } from '../Controllers/ratingController.js';

const router = express.Router();


// POST: Add rating
router.post("/add", addRating);

// GET: Fetch all ratings (admin)
router.get("/all", getAllRatings);

// GET: Get average rating
router.get("/average", getAverageRating);

export default router;