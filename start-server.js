// Simple server setup script
// This will start both PHP server for API and live-server for frontend

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting servers...\n');

// Start PHP server for API (port 8001)
const phpServer = spawn('php', ['-S', 'localhost:8001'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start live-server for frontend (port 8000)
const liveServer = spawn('npx', ['live-server', '--port=8000', '--open=/index.html'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  phpServer.kill();
  liveServer.kill();
  process.exit();
});

console.log('PHP API Server: http://localhost:8001');
console.log('Frontend Server: http://localhost:8000');
console.log('\nPress Ctrl+C to stop servers\n');


