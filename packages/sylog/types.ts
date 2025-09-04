export type Levels = 'log' | 'info' | 'warn' | 'error' | 'success' | 'debug';

export type LogArgs = [...string[], LogOpts];

export type TimeStamp = 'utc' | 'local';

/**
 *
 */
export interface SylogOpts {
  prefix?: string;
  /**
   * @default true
   */
  showTimeStamp?: boolean;
  /**
   * @default "utc"
   */
  timeStamp?: TimeStamp;
  /**
   * @default true
   */
  showLevels?: boolean;
  levels?: Partial<Record<Levels, string | null>>;
}

/**
 *
 */
export interface LogOpts {
  /**
   * @default " "
   */
  sep?: string;
  /**
   * @default "\n"
   */
  end?: string;
}
