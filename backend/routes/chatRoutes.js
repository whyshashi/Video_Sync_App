const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:roomId', verifyToken, getMessages);
router.post('/send', verifyToken, sendMessage);

module.exports = router;
