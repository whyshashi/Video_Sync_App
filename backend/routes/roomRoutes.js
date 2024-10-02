const express = require('express');
const { createRoom, joinRoom, leaveRoom } = require('../controllers/roomController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', verifyToken, createRoom);
router.post('/join', verifyToken, joinRoom);
router.post('/leave', verifyToken, leaveRoom);

module.exports = router;
