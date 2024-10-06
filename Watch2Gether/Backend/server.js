const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const videoController = require('./controllers/videoController');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/room', require('./routes/roomRoutes'));
app.use('/api/video', require('./routes/videoRoutes'));

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: '*' }  
});

app.set('io', io); 

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinRoom', ({ roomId, userId }) => {
        console.log(`User ${userId} joined room ${roomId}`);
        socket.join(roomId);
    });

    socket.on('sendMessage', ({ roomId, userId, user, message }) => {
        io.to(roomId).emit('message', { userId, user, message });
    });

    socket.on('video-control', ({ roomId, action, time }) => {
        console.log(`Action: ${action}, Time: ${time}, Room: ${roomId}`);
        io.to(roomId).emit('video-control', { action, time });  
    });

    videoController.handleVideoControl(socket, io);

    socket.on('new-video', ({ roomId, videoLink }) => {
        console.log(`New video link: ${videoLink} in room ${roomId}`);
        io.to(roomId).emit('new-video', videoLink);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
