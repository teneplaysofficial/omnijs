<div align="center">

# Sylog

_Sync system logs with clear terminal output and durable file storage_

</div>

[![npm](https://img.shields.io/npm/v/sylog.svg)](https://www.npmjs.com/package/sylog) [![npm downloads](https://img.shields.io/npm/d18m/sylog)](https://www.npmjs.com/package/sylog)

Sylog is a lightweight Node.js logging utility that provides **color-coded terminal logs**, optional **timestamps**, **level labels**, and prepares for future **log file support**. Designed for servers, CLI apps, and microservices, Sylog gives developers **real-time visibility** with **durable logging**.

## Features

- Color-coded logs per level: `log`, `info`, `warn`, `error`, `success`, `debug`
- Optional timestamps in UTC or local format
- Customizable level labels and prefix
- Configurable separators and line endings
- Future support for log file persistence (`.log`) for auditing and monitoring

## Installation

```sh
npm install sylog
# or
yarn add sylog
```

## Basic Usage

```ts
import sylog from 'sylog';

sylog.log('This is a general log');
sylog.info('Application started');
sylog.warn('Low disk space');
sylog.error('Failed to connect to database');
sylog.success('Task completed successfully');
sylog.debug('Debug data:', { foo: 'bar' });
```

## Advanced Usage

### Prefixes and Timestamps

```ts
import { Sylog } from 'sylog';

const logger = new Sylog({
  prefix: 'MyApp',
  showTimeStamp: true,
  timeStamp: 'local',
});

logger.info('Application initialized');
logger.error('Something went wrong!');
```

### Custom Log Separators and Endings

```ts
sylog.info('Item 1', 'Item 2', { key: 'value' }, { sep: ' | ', end: '\n\n' });
```

- `sep` - separator between log items (default: `" "`)
- `end` - line ending after the log message (default: `"\n"`)

## Log Levels

| Level   | Default Label | Color  |
| ------- | ------------- | ------ |
| log     | -             | White  |
| info    | INFO          | Blue   |
| warn    | WARN          | Yellow |
| error   | ERROR         | Red    |
| success | SUCCESS       | Green  |
| debug   | DEBUG         | Cyan   |

> Labels can be customized via `SylogOpts.levels` or hidden by setting them to `null` or empty `""`.

## Why Use Sylog?

- **Terminal clarity:** Quickly identify severity through color and label.
- **Optional timestamps:** Track events across different servers or executions.
- **Customizable output:** Prefixes, separators, and line endings make logs readable.
- **Future log file support:** Save logs to `.log` files for:
  - Debugging after crashes
  - Auditing application behavior
  - Collecting production logs for monitoring

## License

Released under the [Apache License 2.0](../../LICENSE).
