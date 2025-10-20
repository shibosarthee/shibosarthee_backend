import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../Controllers/favorite.controller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Add to favorites
router.post('/', protect, addFavorite);

// Remove from favorites
router.delete('/:profileId', protect, removeFavorite);

// Get user's favorites
router.get('/', protect, getFavorites);

export default router;
