const express = require('express');
const { syncVideo, updateTimestamp } = require('../controllers/videoController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/sync', verifyToken, syncVideo);
router.post('/timestamp', verifyToken, updateTimestamp);

module.exports = router;
