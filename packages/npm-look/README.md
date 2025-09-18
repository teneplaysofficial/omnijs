<div align="center">

# npm-look

_NPM name availability at a glance for packages, accounts, and scopes_

</div>

[![npm](https://img.shields.io/npm/v/npm-look.svg)](https://www.npmjs.com/package/npm-look)
[![npm downloads](https://img.shields.io/npm/dw/npm-look)](https://www.npmjs.com/package/npm-look)
[![License](https://img.shields.io/npm/l/npm-look)](../../LICENSE)

## Overview

`npm-look` is a lightweight utility to quickly check the availability of **npm package names** and **usernames**. It supports both CLI usage and programmatic API access. It also checks for potential conflicts with similar names by generating common variants of the input names.

**Why `npm-look`?**

- 10x faster than `npm-name`
- Checks both packages and usernames
- Detects naming conflicts and variants
- Works for scoped packages (`@scope/name`)

## Installation

```bash
npm install -g npm-look
# or
npm install npm-look
```

## CLI Usage

```bash
npx npm-look [--package] <name>   Check npm package name availability
npx npm-look --user <username>    Check npm username availability
```

### Options

| Option          | Description             |
| --------------- | ----------------------- |
| `-p, --package` | Check npm package names |
| `-u, --user`    | Check npm usernames     |
| `-h, --help`    | Show help message       |
| `-v, --version` | Show version number     |

### Examples

```bash
# Check multiple packages
npx npm-look react vue vite

# Check scoped packages
npx npm-look @react/core

# Explicit flags
npx npm-look --package react vue vite @react/core
npx npm-look --user tj npm npmjs react

# Mixed usage
npx npm-look react vite -p git django --user npm js -p vue next -u express
```

## Programmatic API

You can also use `npm-look` in your Node.js scripts or projects.

```ts
import { packageLook, userLook } from 'npm-look';

// Check package names
await packageLook(['react', 'vue', '@react/core']);

// Check usernames
await userLook(['tj', 'npm', 'express']);
```

### Functions

#### `packageLook(name: string | string[])`

Check npm package name availability and potential conflicts.

- **Parameters**
  - `name`: A string or an array of package names.

- **Behavior**
  - Fetches data from `https://registry.npmjs.org/`.
  - Checks availability and logs conflicts using common variants (`-`, `_`, `.`).

- **Example**

  ```ts
  await packageLook('my-awesome-package');
  ```

#### `userLook(username: string | string[])`

Check npm username availability.

- **Parameters**
  - `username`: A string or an array of usernames.

- **Behavior**
  - Fetches data from `https://www.npmjs.com/~`.
  - Validates username format (lowercase letters, numbers, dashes only).
  - Logs whether the username is available or taken.

- **Example**

  ```ts
  await userLook(['tj', 'npm', 'express']);
  ```

## Variant Checks

`npm-look` generates common variants of package names to detect potential conflicts:

- Replaces `-` with `_` or `.` and vice versa.
- Removes characters for alternative naming checks.
- Example:

  ```ts
  import { variantsLook } from 'npm-look';

  variantsLook('my-package');
  // Output: ['mypackage', 'my_package', 'my.package', ...]
  ```

This ensures you can detect similar or conflicting package names before publishing.

## License

Released under the [Apache License 2.0](../../LICENSE).
