const { spawn } = require('child_process');
const path = require('path');

const port = process.env.PORT || 3000;
const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log(`[Render Compatibility] Booting Next.js production server on port ${port}...`);

const child = spawn(process.execPath, [nextPath, 'start', '-p', port], {
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log(`[Render Compatibility] Next.js server exited with code ${code}`);
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[Render Compatibility] Failed to start Next.js process:', err);
  process.exit(1);
});
