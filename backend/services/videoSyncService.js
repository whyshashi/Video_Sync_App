const Room = require('../models/Room');

const syncVideo = async (roomId, videoUrl, timestamp, isPaused) => {
    try {
        const room = await Room.findOne({ roomId });
        if (!room) {
            throw new Error('Room not found');
        }

        room.currentVideo = videoUrl;
        room.timestamp = timestamp;
        room.isPaused = isPaused;
        await room.save();

        return room;
    } catch (error) {
        throw new Error(`Error syncing video: ${error.message}`);
    }
};

module.exports = {
    syncVideo,
};
