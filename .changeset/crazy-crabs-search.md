---
'npm-look': major
---

Initial release

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
