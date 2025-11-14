/** Log levels */
export type Levels = 'log' | 'info' | 'warn' | 'error' | 'success' | 'debug';

/**
 * - Arguments passed to log methods.
 * - Last argument can optionally be {@link LogOpts} to customize.
 */
export type LogArgs = (string | number | object | LogOpts)[];

/** Time formats for timestamps */
export type TimeStamp = 'utc' | 'local';

/** Configuration options for the logger */
export interface SylogOpts {
  /** Optional prefix displayed before each log line */
  prefix?: string;
  /**
   * Show timestamps
   *
   * @default false
   */
  showTimeStamp?: boolean;
  /**
   * Timestamp format
   *
   * @default "utc"
   */
  timeStamp?: TimeStamp;
  /**
   * Show log levels
   *
   * @default true
   */
  showLevels?: boolean;
  /** Custom names for each level or null to hide */
  levels?: Partial<Record<Levels, string | null>>;

  /**
   * Enables debug output
   *
   * @default false
   */
  debug?: boolean;
}

/** Options for a log call */
export interface LogOpts {
  /**
   * Separator between log items
   *
   * @default " "
   */
  sep?: string;
  /**
   * Line ending after the log message
   *
   * @default "\n"
   */
  end?: string;
  /**
   * Override the default level label
   */
  label?: string;
}
