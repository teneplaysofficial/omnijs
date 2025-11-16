# sylog

## 2.1.0

### Minor Changes

- [#9](https://github.com/teneplaysofficial/omnijs/pull/9) [`6b78242`](https://github.com/teneplaysofficial/omnijs/commit/6b78242fe7e6411cfe2be4f9efce9c75acd59cbd) Thanks [@teneplaysofficial](https://github.com/teneplaysofficial)! - **Added**
  - Introduced a new `dryrun` log level to indicate simulated operations.
  - Added `sylog.dryrun()` helper method.
  - Added default `DRYRUN` label and magenta styling for dry-run messages.

  **Changed**
  - Updated the `debug` log level color from cyan to gray for improved readability and reduced visual noise.
  - Extended internal `Levels` type and color/label maps to support the new `dryrun` log level and updated `debug` color.

## 2.0.0

### Major Changes

- [#8](https://github.com/teneplaysofficial/omnijs/pull/8) [`c0deafe`](https://github.com/teneplaysofficial/omnijs/commit/c0deafef83f88977ef2352fd8e8a4e3a12af2291) Thanks [@teneplaysofficial](https://github.com/teneplaysofficial)! - This release introduces new logging features including runtime label updates, per-log label overrides, and debug mode controls.

  ### WHAT changed (breaking change)

  Sylog now treats the **last argument** of any log method (`info`, `warn`, `error`, `success`, `debug`, `log`) as **options** if it contains a `label` key.
  This new `label` option overrides the default level label for that specific log call.

  ### WHAT'S NEW

  Sylog now includes several new methods:
  - **`enableDebug()`** - Enables debug mode. When enabled, `debug()` logs will be printed.
  - **`disableDebug()`** - Disables debug mode.
  - **`isDebugEnabled()`** - Returns whether debug mode is currently active.
  - **`setLevels()`** - Updates log level labels globally at runtime.
  - **`getLevels()`** - Returns the current log level label configuration (a copy of the internal levels map).

## 1.0.0

### Major Changes

- 3a6c2c1: Initial release of Sylog.

  Features:
  - Lightweight Node.js logging utility with color-coded terminal logs.
  - Supports log levels: log, info, warn, error, success, debug.
  - Optional timestamps in UTC or local format.
  - Customizable prefixes, level labels, separators, and line endings.
  - Prepared for future `.log` file support for durable logging.
  - Fully typed with TypeScript and detailed JSDoc/TypeDoc examples.
  - Singleton instance for easy use (`sylog`).

### Patch Changes

- 2fd5218: Added default export for `sylog` instance
  - ansilory@2.0.1
