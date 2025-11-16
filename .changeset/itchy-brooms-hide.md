---
'sylog': minor
---

**Added**

- Introduced a new `dryrun` log level to indicate simulated operations.
- Added `sylog.dryrun()` helper method.
- Added default `DRYRUN` label and magenta styling for dry-run messages.

**Changed**

- Updated the `debug` log level color from cyan to gray for improved readability and reduced visual noise.
- Extended internal `Levels` type and color/label maps to support the new `dryrun` log level and updated `debug` color.
