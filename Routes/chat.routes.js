const express = require('express');
const router = express.Router();
const { getChatHistory, getRecentChats } = require('../Controllers/chat.controller');
const { protect } = require('../middleware/authmiddleware');

// Get chat history between two users
router.get('/history/:userId/:otherUserId', protect, getChatHistory);

// Get recent chats for a user
router.get('/recent/:userId', protect, getRecentChats);

module.exports = router;