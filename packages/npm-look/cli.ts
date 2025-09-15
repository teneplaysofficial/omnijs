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
