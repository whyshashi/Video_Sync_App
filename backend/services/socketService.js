const Room = require('../models/Room');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
        });

        socket.on('sync_video', async (data) => {
            const { roomId, videoUrl, timestamp, isPaused } = data;
            const room = await Room.findOne({ roomId });

            if (room) {
                room.currentVideo = videoUrl;
                room.timestamp = timestamp;
                room.isPaused = isPaused;
                await room.save();

                io.to(roomId).emit('video_synced', {
                    videoUrl,
                    timestamp,
                    isPaused,
                });
            }
        });

        socket.on('send_message', (data) => {
            const { roomId, message } = data;
            io.to(roomId).emit('receive_message', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
