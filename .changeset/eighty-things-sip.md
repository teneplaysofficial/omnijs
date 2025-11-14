---
'sylog': major
---

This release introduces new logging features including runtime label updates, per-log label overrides, and debug mode controls.

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
