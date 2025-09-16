import { packageLook, userLook } from './index.js';
import pkg from './package.json' with { type: 'json' };

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
npm-look ${pkg.version} - Check npm package name availability at a glance

Usage:
  npm-look [--package] <name>   Check npm packages (default)
  npm-look --user <username>    Check npm user accounts

Options:
  -p, --package    Check npm package names availability (default)
  -u, --user       Check npm account username availability
  -h, --help       Display this help message
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

const user_names: string[] = [];
const package_names: string[] = [];

let currentFlag: '-p' | '-u' = '-p';

for (const arg of args) {
  switch (arg) {
    case '-p':
    case '--package':
      currentFlag = '-p';
      break;

    case '-u':
    case '--user':
      currentFlag = '-u';
      break;

    default:
      if (!arg.startsWith('-')) {
        (currentFlag === '-p' ? package_names : user_names).push(arg);
      }
  }
}

if (package_names.length > 0) {
  await packageLook(package_names);
}

if (user_names.length > 0) {
  await userLook(user_names);
}
