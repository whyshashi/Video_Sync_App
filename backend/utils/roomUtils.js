const Room = require('../models/Room');

const createRoom = async (ownerId, videoUrl) => {
    try {
        const room = new Room({
            owner: ownerId,
            currentVideo: videoUrl,
            timestamp: 0,
            isPaused: true,
        });
        await room.save();
        return room;
    } catch (error) {
        throw new Error(`Error creating room: ${error.message}`);
    }
};

const findRoomById = async (roomId) => {
    try {
        const room = await Room.findOne({ roomId });
        if (!room) {
            throw new Error('Room not found');
        }
        return room;
    } catch (error) {
        throw new Error(`Error finding room: ${error.message}`);
    }
};

module.exports = {
    createRoom,
    findRoomById,
};
