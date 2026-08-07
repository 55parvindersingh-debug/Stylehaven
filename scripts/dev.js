const { spawn } = require('child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [
  spawn(npmCommand, ['run', 'dev', '--workspace', 'server'], { stdio: 'inherit', shell: true }),
  spawn(npmCommand, ['run', 'dev', '--workspace', 'client'], { stdio: 'inherit', shell: true }),
];

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) if (!child.killed) child.kill('SIGTERM');
  setTimeout(() => process.exit(code), 400).unref();
}
for (const child of children) {
  child.on('error', (error) => { console.error('Unable to start a development process:', error.message); shutdown(1); });
  child.on('exit', (code, signal) => {
    if (!shuttingDown && code !== 0) { console.error(`A development process stopped unexpectedly (${signal || code}).`); shutdown(code || 1); }
  });
}
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
