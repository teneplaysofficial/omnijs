import ansi from 'ansilory';
import { Writable } from 'stream';
import { Levels, LogArgs, LogOpts, SylogOpts } from './types.js';

export class Sylog {
  private opts: SylogOpts;

  private LEVEL_COLORS: Record<Levels, (txt: string) => string> = {
    log: (txt) => ansi.white.apply(txt),
    info: (txt) => ansi.blue.bold.apply(txt),
    warn: (txt) => ansi.yellow.bold.apply(txt),
    error: (txt) => ansi.red.bold.apply(txt),
    success: (txt) => ansi.green.bold.apply(txt),
    debug: (txt) => ansi.cyan.bold.apply(txt),
  };

  private DEFAULT_OPTS: SylogOpts = {
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
  };

  constructor(options?: SylogOpts) {
    this.opts = {
      ...this.DEFAULT_OPTS,
      ...options,
    };
  }

  private isLogOpts(arg: unknown) {
    return (
      typeof arg === 'object' &&
      arg !== null &&
      !Array.isArray(arg) &&
      ('sep' in arg || 'end' in arg)
    );
  }

  private write(stream: Writable, levelKey: Levels, ...args: LogArgs) {
    let logOpts: LogOpts = { sep: ' ', end: '\n' };

    if (args.length && this.isLogOpts(args[args.length - 1])) {
      logOpts = { ...logOpts, ...(args.pop() as LogOpts) };
    }

    const timestamp = this.opts.showTimeStamp
      ? ansi.gray.apply(
          `[${
            this.opts.timeStamp === 'utc'
              ? new Date().toISOString().replace('T', ' ').slice(0, 19)
              : new Date().toLocaleString('sv-SE')
          }]`,
        )
      : '';

    const msg = args
      .map((a) =>
        typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a),
      )
      .join(logOpts.sep);

    const levelText = this.opts.levels?.[levelKey];
    const coloredLevel = levelText
      ? this.LEVEL_COLORS[levelKey](`[${levelText}]`)
      : null;

    const parts =
      [
        this.opts.prefix && ansi.gray.bold.apply(this.opts.prefix),
        timestamp,
        this.opts.showLevels && coloredLevel,
        msg,
      ]
        .filter(Boolean)
        .join(' ') + logOpts.end;

    stream.write(parts);
  }

  log(...args: LogArgs) {
    this.write(process.stdout, 'log', ...args);
  }

  info(...args: LogArgs) {
    this.write(process.stdout, 'info', ...args);
  }

  warn(...args: LogArgs) {
    this.write(process.stderr, 'warn', ...args);
  }

  error(...args: LogArgs) {
    this.write(process.stderr, 'error', ...args);
  }

  success(...args: LogArgs) {
    this.write(process.stdout, 'success', ...args);
  }

  debug(...args: LogArgs) {
    this.write(process.stdout, 'debug', ...args);
  }
}

export const sylog = new Sylog();
