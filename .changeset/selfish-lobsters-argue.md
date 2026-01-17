---
"ansilory": patch
---

Add a `prepack` script to ensure the package is built before publishing.

This guarantees that the compiled `dist` files are always included in the published package, preventing missing entrypoints in strict package managers like pnpm and in CI environments.
