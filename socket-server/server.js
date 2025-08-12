const { Server } = require('socket.io');
const cors = require('cors');

// Get port from environment variable (Railway will provide this)
const PORT = process.env.PORT || 3001;

const io = new Server(PORT, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      "http://localhost:3000",
      "https://agrotrade-ibipx3l6s-debabrata-ghoshs-projects.vercel.app",
      "https://agrotrade-blush.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join a room for a specific chat (e.g., productId + buyerId + sellerId) or for notifications (email)
  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Handle incoming messages
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast to chat room
    io.to(msg.roomId).emit('message', msg);
    // Notify the recipient (seller or buyer)
    if (msg.buyer && msg.seller) {
      const recipientRoom = msg.sender === msg.buyer ? msg.seller : msg.buyer;
      io.to(recipientRoom).emit('new-message', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

console.log(`Socket.IO server running on port ${PORT}`);
console.log('Allowed origins:', process.env.ALLOWED_ORIGINS || 'Default origins');
