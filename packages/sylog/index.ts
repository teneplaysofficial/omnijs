import ansi from 'ansilory';
import { Writable } from 'stream';
import { Levels, LogArgs, LogOpts, SylogOpts } from './types.js';

/**
 * The main Sylog logger class
 *
 * @example
 * ```ts
 * import { Sylog } from 'sylog';
 * const logger = new Sylog({ prefix: 'MyApp', showTimeStamp: true });
 *
 * logger.log('General log message');
 * logger.info('Application started');
 * logger.warn('Low disk space');
 * logger.error('Failed to connect to database');
 * logger.success('Task completed successfully');
 * logger.debug('Debug info', { foo: 'bar' });
 * ```
 */
export class Sylog {
  private opts: SylogOpts;

  /** Color functions for each log level */
  private LEVEL_COLORS: Record<Levels, (txt: string) => string> = {
    log: (txt) => ansi.white.apply(txt),
    info: (txt) => ansi.blue.bold.apply(txt),
    warn: (txt) => ansi.yellow.bold.apply(txt),
    error: (txt) => ansi.red.bold.apply(txt),
    success: (txt) => ansi.green.bold.apply(txt),
    debug: (txt) => ansi.cyan.bold.apply(txt),
  };

  /** Default {@link SylogOpts} options */
  private DEFAULT_OPTS: SylogOpts = {
    showTimeStamp: false,
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

  /** Creates a new Sylog instance */
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

  /**
   * Logs a general message
   *
   * @example
   * ```ts
   * sylog.log('This is a general log');
   * ```
   */
  log(...args: LogArgs) {
    this.write(process.stdout, 'log', ...args);
  }

  /**
   * Logs an informational message
   *
   * @example
   * ```ts
   * sylog.info('Server started successfully');
   * ```
   */
  info(...args: LogArgs) {
    this.write(process.stdout, 'info', ...args);
  }

  /**
   * Logs a warning message
   *
   * @example
   * ```ts
   * sylog.warn('Disk space is running low');
   * ```
   */
  warn(...args: LogArgs) {
    this.write(process.stderr, 'warn', ...args);
  }

  /**
   * Logs an error message
   *
   * @example
   * ```ts
   * sylog.error('Failed to connect to database');
   * ```
   */
  error(...args: LogArgs) {
    this.write(process.stderr, 'error', ...args);
  }

  /**
   * Logs a success message
   *
   * @example
   * ```ts
   * sylog.success('Task completed successfully');
   * ```
   */
  success(...args: LogArgs) {
    this.write(process.stdout, 'success', ...args);
  }

  /**
   * Logs a debug message
   *
   * @example
   * ```ts
   * sylog.debug('Debug info', { foo: 'bar' });
   * ```
   */
  debug(...args: LogArgs) {
    this.write(process.stdout, 'debug', ...args);
  }
}

/**
 * Default singleton
 *
 * ```ts
 * import sylog from 'sylog';
 *
 * sylog.log('General log');
 * sylog.info('App started');
 * sylog.warn('Warning message');
 * sylog.error('Error occurred');
 * sylog.success('Success!');
 * sylog.debug('Debug details:', { foo: 'bar' });
 * ```
 */
export const sylog = new Sylog();
