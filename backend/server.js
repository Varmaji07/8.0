// 1. Database Connection
require('./config/db');

// 2. Import Libraries
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// 3. Initialize the App
const app = express();
app.use(cors());
const port = 5001;

// 4. Create HTTP Server for Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this dev environment
        methods: ["GET", "POST"]
    }
});

// 5. Use Middleware
app.use(express.json());

// 6. Import Routes
const userRouter = require('./api/User');

// 7. Video Chat / Jokes Endpoint
const jokes = [
    { id: 1, title: 'Joke 1', content: 'Joke 1 content' },
    { id: 2, title: 'Joke 2', content: 'Joke 2 content' },
    { id: 3, title: 'Joke 3', content: 'Joke 3 content' }
];

app.get('/jokes', (req, res) => {
    res.send(jokes);
});

// 8. Socket.io Signaling Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', (roomId, userName) => {
        socket.join(roomId);
        socket.userName = userName;
        console.log(`User ${userName || socket.id} joined room: ${roomId}`);
    });

    socket.on('send-message', ({ roomId, message }) => {
        io.to(roomId).emit('message', { userId: socket.id, userName: socket.userName, message });
    });

    // WebRTC Signaling
    socket.on('offer', ({ roomId, offer, userName }) => {
        socket.to(roomId).emit('offer', { userId: socket.id, offer, userName });
    });

    socket.on('answer', ({ roomId, answer, userName }) => {
        socket.to(roomId).emit('answer', { userId: socket.id, answer, userName });
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
        socket.to(roomId).emit('ice-candidate', { userId: socket.id, candidate });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// 9. Use Routes
app.use('/user', userRouter);

// 10. Serve Static Files from Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// 11. Catch-all to serve index.html for any frontend routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 12. Start Server
server.listen(port, () => {
    console.log(`Unified Server is running on port ${port}`);
});