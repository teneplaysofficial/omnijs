import { packageLook, userLook } from './index.js';
import pkg from './package.json' with { type: 'json' };

const args = process.argv.slice(2);

if (!args.length || args.includes('--help') || args.includes('-h')) {
  console.log(`
npm-look ${pkg.version} - Check npm package name and username availability at a glance

Usage:
  npm-look [--package] <name>   Check npm packages name availability
  npm-look --user <username>    Check npm user name availability

Options:
  -p, --package    Check npm package names
  -u, --user       Check npm usernames
  -h, --help       Show this help message
  -v, --version    Show version number

Examples:
  npm-look react vite -p git django --user npm js -p vue next -u express
  npm-look react vue vite @react/core
  npm-look --package react vue vite @react/core
  npm-look --user tj npm npmjs react
`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

const users: string[] = [];
const packages: string[] = [];
let currentFlag: '-p' | '-u' = '-p';

for (const arg of args) {
  if (arg === '-p' || arg === '--package') currentFlag = '-p';
  else if (arg === '-u' || arg === '--user') currentFlag = '-u';
  else if (!arg.startsWith('-')) {
    if (arg.startsWith('@')) packages.push(arg);
    else (currentFlag === '-p' ? packages : users).push(arg);
  }
}

if (packages.length) await packageLook(packages);
if (users.length) await userLook(users);
