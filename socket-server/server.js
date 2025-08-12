const { Server } = require('socket.io');
const cors = require('cors');

// Get port from environment variable (Render will provide this)
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting AgroTrade Socket Server...');
console.log(`📍 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

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
  console.log('✅ Client connected:', socket.id);
  
  // Join a room for a specific chat (e.g., productId + buyerId + sellerId) or for notifications (email)
  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`🔗 Socket ${socket.id} joined room: ${roomId}`);
  });

  // Handle incoming messages
  socket.on('message', (msg) => {
    console.log('💬 Message received:', msg);
    // Broadcast to chat room
    io.to(msg.roomId).emit('message', msg);
    // Notify the recipient (seller or buyer)
    if (msg.buyer && msg.seller) {
      const recipientRoom = msg.sender === msg.buyer ? msg.seller : msg.buyer;
      io.to(recipientRoom).emit('new-message', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Health check endpoint for Render
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT + 1, () => {
  console.log(`🏥 Health check server running on port ${PORT + 1}`);
});

console.log(`🎯 Socket.IO server running on port ${PORT}`);
console.log('🌐 Allowed origins:', process.env.ALLOWED_ORIGINS || 'Default origins');
console.log('✨ AgroTrade Socket Server is ready!');
