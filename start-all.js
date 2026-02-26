#!/usr/bin/env node

/**
 * Website Decompiler - Complete Launcher Script
 * Starts both backend and frontend servers
 */

const { spawn } = require('child_process');
const path = require('path');

const projectRoot = __dirname;
const serverDir = path.join(projectRoot, 'server');
const clientDir = path.join(projectRoot, 'client');

console.log('\n========================================');
console.log('  🔓 Website Decompiler Launcher');
console.log('========================================\n');

// Function to start a service
function startService(name, cwd, command) {
  console.log(`🚀 Starting ${name}...`);
  
  const proc = spawn('npm', ['start'], {
    cwd,
    stdio: 'inherit',
    shell: true
  });

  proc.on('error', (err) => {
    console.error(`❌ Failed to start ${name}:`, err.message);
    process.exit(1);
  });

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ ${name} exited with code ${code}`);
    }
  });

  return proc;
}

// Start backend
console.log('📦 Backend Server');
console.log('Location:', serverDir);
startService('Backend Server', serverDir, 'npm start');

setTimeout(() => {
  console.log('\n\n');
  
  // Start frontend
  console.log('🌐 Frontend Application');
  console.log('Location:', clientDir);
  startService('Frontend', clientDir, 'npm start');
}, 2000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down servers...');
  process.exit(0);
});

console.log('\n✅ Servers are starting...');
console.log('\n📝 Access the application at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('\n⚠️  Press Ctrl+C to stop all servers\n');
