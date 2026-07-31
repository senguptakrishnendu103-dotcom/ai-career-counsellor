const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');

// Self-healing: if the production build does not exist, compile it now
if (!fs.existsSync(buildIdPath)) {
  console.log('[Render Compatibility] Production build not found. Running "next build"...');
  
  const buildResult = spawnSync(process.execPath, [nextPath, 'build'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  if (buildResult.status !== 0) {
    console.error('[Render Compatibility] Next.js build failed.');
    process.exit(buildResult.status || 1);
  }
  
  console.log('[Render Compatibility] Production build compiled successfully!');
}

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
