import ansi from 'ansilory';
import { Writable } from 'stream';
import { LogArgs, SylogOpts } from './types.js';

export class Sylog {
  private opts: SylogOpts;

  constructor(
    options: SylogOpts = {
      showTimeStamp: true,
      timeStamp: 'utc',
      showLevels: true,
      levels: {
        log: null,
        info: 'INFO',
        warn: 'WARN',
        error: 'ERROR',
        success: 'SUCCESS',
        debug: 'DEBUG',
      },
    },
  ) {
    this.opts = { ...options };
  }

  private write(
    stream: Writable,
    levelName: string | null | undefined,
    args: LogArgs,
  ) {
    const time = '';
    const msg = '';
    const parts = [this.opts.prefix, time, `[${levelName}]`, msg];

    stream.write(parts.filter(Boolean).join(' '));
  }

  log(...args: LogArgs) {
    this.write(process.stdout, this.opts.levels?.log, args);
  }

  info(...args: LogArgs) {
    this.write(process.stdout, this.opts.levels?.info, args);
  }

  warn(...args: LogArgs) {
    this.write(process.stderr, this.opts.levels?.info, args);
  }

  error(...args: LogArgs) {
    this.write(process.stderr, this.opts.levels?.info, args);
  }

  success(...args: LogArgs) {
    this.write(process.stdout, this.opts.levels?.info, args);
  }

  debug(...args: LogArgs) {
    this.write(process.stdout, this.opts.levels?.info, args);
  }
}

export const sylog = new Sylog();
