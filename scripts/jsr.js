import { execSync } from 'child_process';
import { globSync, readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Usage:
  node scripts/jsr.js [options]

Options:
  --write       Update jsr.json with version from package.json
  --dry-run     Run "npx jsr publish --dry-run" in each package
  --publish     Run "npx jsr publish" in each package
`);

  process.exit(1);
}

const file = readFileSync('pnpm-workspace.yaml', 'utf-8');
const workspace = yaml.load(file).packages;

for (const pattern of workspace) {
  const dirs = globSync(pattern);

  for (const dir of dirs) {
    let pkg;

    try {
      pkg = JSON.parse(readFileSync(`${dir}/package.json`, 'utf-8'));
    } catch {
      console.log('[NPM] package.json not found in', dir);
      continue;
    }

    if (pkg.private) {
      console.log(dir, 'is private, skipping');
      continue;
    }

    let jsr;
    try {
      jsr = JSON.parse(readFileSync(`${dir}/jsr.json`, 'utf-8'));
    } catch {
      console.log('[JSR] jsr.json not found in', dir);
    }

    if (args.includes('--write')) {
      if (pkg.version === jsr.version) {
        console.log(`[JSR] ${dir} already at version ${pkg.version}, skipping`);
        continue;
      }
      jsr.version = pkg.version;
      writeFileSync(`${dir}/jsr.json`, JSON.stringify(jsr, null, 2));
      console.log(`[JSR] wrote jsr.json in ${dir} (version ${pkg.version})`);
    }

    if (args.includes('--dry-run')) {
      console.log(`[JSR] running dry-run publish in ${dir}`);
      execSync('npx jsr publish --dry-run  --allow-dirty', {
        cwd: dir,
        stdio: 'inherit',
      });
    }

    if (args.includes('--publish')) {
      console.log(`[JSR] publishing from ${dir}`);
      execSync('npx jsr publish  --allow-dirty', {
        cwd: dir,
        stdio: 'inherit',
      });
    }
  }
}
