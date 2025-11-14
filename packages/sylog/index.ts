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
 *
 * @example
 * ```ts
 * import { sylog } from 'sylog';
 *
 * sylog.info('Starting server...');
 * sylog.success('Server started successfully!');
 *
 * // Enable debug logs
 * sylog.enableDebug();
 * sylog.debug('Debug mode active', { label: 'Trace' });
 *
 * // Customize global labels at runtime
 * sylog.setLevels({ info: 'ℹ️', success: '✅', error: '❌' });
 *
 * // Per-call label override
 * sylog.info('Startup complete', { label: 'Information' });
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
    debug: false,
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

    const levelText = logOpts.label ?? this.opts.levels?.[levelKey];
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
   * Enables debug mode.
   *
   * When enabled, `debug()` logs will be printed to the console.
   *
   * @example
   * ```ts
   * sylog.enableDebug();
   * sylog.debug('Verbose details');
   * ```
   */
  enableDebug() {
    this.opts.debug = true;
  }

  /**
   * Disables debug mode.
   *
   * @example
   * ```ts
   * sylog.disableDebug();
   * sylog.debug('This will not print');
   * ```
   */
  disableDebug() {
    this.opts.debug = false;
  }

  /**
   * Returns whether debug mode is currently enabled.
   *
   * @returns `true` if debug mode is active.
   */
  isDebugEnabled() {
    return !!this.opts.debug;
  }

  /**
   * Updates log level labels globally at runtime.
   *
   * @example
   * ```ts
   * sylog.setLevels({ info: 'ℹ️ Info', success: '✅ Done' });
   * ```
   */
  setLevels(
    /**
     * A partial map of log levels and new label strings.
     */
    levels: Pick<SylogOpts, 'levels'>,
  ) {
    this.opts.levels = {
      ...this.opts.levels,
      ...levels,
    };
  }

  /**
   * Returns the current log level label configuration.
   *
   * @returns A copy of the internal levels map.
   */
  getLevels() {
    return { ...this.opts.levels };
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
    if (!this.opts.debug) return;
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
export default sylog;
