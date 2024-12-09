// src/routes/chatRoutes.js
const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const router = express.Router();

// Ensure you have a JWT authentication middleware here if required
router.post('/send', sendMessage);
router.get('/history', getMessages);

module.exports = router;
