const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = path.join(__dirname, '..');
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.js')) files.push(target);
  }
}
walk(root);
let failures = 0;
for (const file of files.sort()) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures += 1;
    console.error(`Syntax error: ${path.relative(root, file)}`);
    console.error(result.stderr || result.stdout);
  }
}
if (failures) process.exit(1);
console.log(`Server syntax check passed for ${files.length} JavaScript files.`);
