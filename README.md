# OmniJS

[![Build](https://github.com/teneplaysofficial/omnijs/actions/workflows/release.yml/badge.svg)](https://github.com/teneplaysofficial/omnijs/actions/workflows/release.yml)
[![CI](https://github.com/teneplaysofficial/omnijs/actions/workflows/ci.yml/badge.svg)](https://github.com/teneplaysofficial/omnijs/actions/workflows/ci.yml)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/teneplaysofficial/omnijs)
[![Lint: ESLint](https://img.shields.io/badge/lint-eslint-4B32C3)](https://github.com/teneplaysofficial/omnijs)

**OmniJS** is a curated collection of lightweight, versatile JavaScript tools designed to simplify development workflows, automate repetitive tasks, and boost productivity for both frontend and backend projects. Built with TypeScript, these packages are modular, well-tested, and optimized for modern JavaScript ecosystems.

## Features

- **Modular Design**: Each package is independent, allowing you to use only what you need.
- **TypeScript Support**: Fully typed for better developer experience and fewer runtime errors.
- **Cross-Platform**: Works seamlessly in Node.js, Deno, and browser environments (where applicable).
- **CI/CD Integration**: Automated builds, tests, and releases via GitHub Actions.

## Packages

| Package    | Version                                                           | npm                                                   | JSR                                  | Description                                         |
| ---------- | ----------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `ansilory` | ![npm version](https://img.shields.io/npm/v/ansilory.svg)         | [npm](https://www.npmjs.com/package/ansilory)         | [JSR](https://jsr.io/@tene/ansilory) | ANSI color and style utilities for terminal output. |
| `git-log`  | ![npm version](https://img.shields.io/npm/v/@tenedev/git-log.svg) | [npm](https://www.npmjs.com/package/@tenedev/git-log) | [JSR](https://jsr.io/@tene/git-log)  | Simplified Git log parsing and analysis.            |
| `kolory`   | ![npm version](https://img.shields.io/npm/v/kolory.svg)           | [npm](https://www.npmjs.com/package/kolory)           | [JSR](https://jsr.io/@tene/kolory)   | Advanced color manipulation for web and CLI.        |

> Explore individual package READMEs in the `packages/` directory for detailed usage instructions.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/teneplaysofficial/omnijs.git`.
3. Install dependencies: `pnpm install`.
4. Create a new branch: `git checkout -b my-feature`.
5. Make changes and commit: `git commit -m "feat: Add my feature"`.
6. Push to your fork: `git push origin my-feature`.
7. Open a pull request.

<!-- Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) for more details. -->

## Development

This monorepo uses [pnpm](https://pnpm.io/) for package management. To set up the development environment:

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Run tests across all packages
pnpm test

# Build all packages
pnpm build
```

## Contact

- **Issues**: [GitHub Issues](https://github.com/teneplaysofficial/omnijs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/teneplaysofficial/omnijs/discussions)
- **Twitter**: [@teneplays](https://twitter.com/teneplays)

## License

Licensed under the [Apache-2.0 License](LICENSE).
