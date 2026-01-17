# npm-look

## 1.0.2

### Patch Changes

- Updated dependencies [[`2b9b18e`](https://github.com/teneplaysofficial/omnijs/commit/2b9b18e8e152bea0f41a1ee73325aab6e7a84e90)]:
  - ansilory@2.0.2

## 1.0.1

### Patch Changes

- [#6](https://github.com/teneplaysofficial/omnijs/pull/6) [`04ac034`](https://github.com/teneplaysofficial/omnijs/commit/04ac03444ccd52f76fdd192ee216aa6eb7586dc0) Thanks [@teneplaysofficial](https://github.com/teneplaysofficial)! - polish docs

## 1.0.0

### Major Changes

- [#5](https://github.com/teneplaysofficial/omnijs/pull/5) [`4e01a6f`](https://github.com/teneplaysofficial/omnijs/commit/4e01a6f4d812424c03942cd1ac0ff35bd0b02670) Thanks [@teneplaysofficial](https://github.com/teneplaysofficial)! - Initial release

  ### Highlights
  - Full-featured CLI for checking npm package names and usernames
  - Programmatic API to integrate npm checks in scripts or Node.js projects
  - Handles both regular and scoped packages (`@scope/name`)
  - Detects naming conflicts using variants (`-`, `_`, `.`)
  - Validates npm usernames (lowercase letters, numbers, dashes only)
  - Colorful CLI output using `ansilory` for better readability
  - 10x faster and more reliable than `npm-name`
  - Supports mixed usage of flags (`-p/--package` and `-u/--user`) in one command
  - Graceful error handling for invalid names or network issues
