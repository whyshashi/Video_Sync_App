const Room = require('../models/Room');

exports.syncVideo = async (req, res) => {
    try {
        const { roomId, videoUrl, isPaused } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        room.currentVideo = videoUrl;
        room.isPaused = isPaused;
        await room.save();
        res.status(200).json({ message: 'Video synced successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error syncing video', error });
    }
};

exports.updateTimestamp = async (req, res) => {
    try {
        const { roomId, timestamp } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        room.timestamp = timestamp;
        await room.save();
        res.status(200).json({ message: 'Timestamp updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating timestamp', error });
    }
};
