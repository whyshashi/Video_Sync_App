const Room = require('../models/Room');

exports.addVideoLink = async (req, res) => {
    const { roomId, link } = req.body;

    if (!link || !isValidUrl(link)) {
        return res.status(400).json({ msg: 'Invalid video link' });
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ msg: 'Room not found' });

        if (room.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Only the room owner can add the video link' });
        }

        room.videoLink = link;
        await room.save();

        const io = req.app.get('io');  
        if (!io) {
            console.error('Socket.IO instance not found');
            return res.status(500).send('Server error');
        }

        io.to(roomId).emit('new-video', link);

        res.json(room);
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.handleVideoControl = (socket, io) => {
    socket.on('video-control', ({ roomId, action, time }) => {
        console.log(`Broadcasting action: ${action}, time: ${time}, to room: ${roomId}`);
        io.to(roomId).emit('video-control', { action, time });  
    });
};

const isValidUrl = (urlString) => {
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
};
