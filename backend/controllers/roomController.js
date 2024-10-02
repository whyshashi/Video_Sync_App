const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');

exports.createRoom = async (req, res) => {
    try {
        const roomId = uuidv4();
        const room = new Room({
            roomId,
            host: req.userId,
        });
        await room.save();
        res.status(201).json({ roomId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        room.users.push(req.userId);
        await room.save();
        res.status(200).json({ message: 'Joined room' });
    } catch (error) {
        res.status(500).json({ message: 'Error joining room', error });
    }
};

exports.leaveRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        room.users = room.users.filter(user => user.toString() !== req.userId);
        await room.save();
        res.status(200).json({ message: 'Left room' });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving room', error });
    }
};
