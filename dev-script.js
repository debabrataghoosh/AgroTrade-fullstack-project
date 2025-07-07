const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting development servers...\n');

// Start Socket.IO server
const socketServer = spawn('node', ['socket-server.js'], {
  stdio: 'inherit',
  shell: true
});

console.log('📡 Socket.IO server starting on port 3001...');

// Start Next.js development server
const nextServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

console.log('🌐 Next.js server starting on port 3000...\n');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  socketServer.kill('SIGINT');
  nextServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  socketServer.kill('SIGTERM');
  nextServer.kill('SIGTERM');
  process.exit(0);
}); 