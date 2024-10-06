const express = require('express');
const { createRoom, getRoom, joinRoom, endRoom } = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, roleMiddleware(['organizer', 'admin']), createRoom);

router.get('/:roomId', authMiddleware, getRoom); 

router.post('/join', authMiddleware, joinRoom);

router.post('/end', authMiddleware, roleMiddleware(['admin']), endRoom); 

module.exports = router;
