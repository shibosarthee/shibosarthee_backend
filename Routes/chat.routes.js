// chat.routes.js
import express from 'express';
import { getChatHistory, getRecentChats } from '../Controllers/chat.controller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Get chat history between two users
router.get('/history/:userId/:otherUserId', protect, getChatHistory);

// Get recent chats for a user
router.get('/recent/:userId', protect, getRecentChats);

export default router;
