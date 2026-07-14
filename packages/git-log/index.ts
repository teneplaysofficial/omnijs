import { execSync } from 'child_process';

/**
 * Mapping of available Git log field names to their corresponding `git log --pretty=format` placeholders.
 */
enum FieldData {
  hash = '%H',
  shortHash = '%h',
  author = '%an',
  email = '%ae',
  date = '%aI',
  subject = '%s',
  body = '%b',
}

/**
 * Supported Git log fields
 */
export type GitField =
  /**
   * full commit hash (40 chars)
   *
   * @example "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
   */
  | 'hash'
  /**
   * short commit hash (7 chars)
   *
   * @example "a1b2c3d"
   */
  | 'shortHash'
  /**
   * author name
   * @example "John Doe"
   */
  | 'author'
  /**
   * author email
   */
  | 'email'
  /**
   * commit date (ISO 8601)
   *
   * @example "2023-10-05 14:48:00 +0200"
   */
  | 'date'
  /**
   * commit subject (first line)
   *
   * @example "fix: correct minor typos in code"
   */
  | 'subject'
  /**
   * commit body (everything except first line)
   *
   * @example "see the issue for details"
   */
  | 'body'
  /**
   * formatted date
   */
  | 'formattedDate';

/**
 * Options for retrieving Git logs
 */
export interface LogOptions {
  /**
   * fields to include in the output
   *
   * @default ['hash', 'shortHash', 'author', 'email', 'date', 'subject', 'body']
   *
   * @example ['hash', 'author', 'date', 'subject']
   */
  fields?: GitField[];
  /**
   * number of data items to return
   *
   * @default null (all)
   */
  limit?: number | null;
  range: /**
   * no tag base, full history
   */
  | 'all'
    /**
     * tag or commit base range
     *
     */
    | {
        /**
         * tag or commit hash
         *
         * @default "latest tag"
         */
        from: string | null;
        /**
         * tag or commit hash
         *
         * @default "HEAD"
         */
        to?: string;
      };
  /**
   * filter commits since this date (inclusive)
   * @example "2024-01-01"
   */
  since?: string;

  /**
   * filter commits until this date (inclusive)
   * @example "2024-12-31"
   */
  until?: string;
  /**
   * filter commits by author name or email
   */
  author?: string;
  /**
   * branch to get logs from
   *
   * @default "all"
   *
   * @example "main" | "develop" | "feature/foo"
   */
  branch?: string;
}

/**
 * Options for formatting Git log output
 */
export interface FormatOptions {
  /**
   * output style
   *
   * @default "json"
   */
  style?: 'json' | 'csv' | 'md';
  /**
   * delimiter for csv style
   *
   * @default ","
   */
  delimiter?: ',' | ';';
  /**
   * markdown style
   *
   * @default "block"
   */
  mdStyle?: 'block' | 'table' | 'list';
  /**
   * pretty print json output
   *
   * @default true
   */
  pretty?: boolean;
  /**
   * custom date format for `formatDate` field
   *
   * @default "YYYY-MM-DD"
   */
  dateFormat?: 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY';
}

/**
 * Run a shell command and return trimmed output
 *
 * @returns stdout of the command, empty string if it fails
 */
function runCommand(
  /**
   * Command to run
   */
  cmd: string,
  /**
   * Arguments to pass to the command.
   */
  args: string[] = [],
  /**
   * suppressErrorOutput If true, hide stderr messages
   *
   * @default false
   */
  suppressErrorOutput = false,
): string {
  try {
    return execSync(cmd, {
      args,
      stdio: suppressErrorOutput
        ? ['pipe', 'pipe', 'ignore']
        : ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

/**
 * Get the latest Git tag (lightweight or annotated).
 *
 * @returns latest tag string, or empty string if none found
 */
export function getLatestTag(): string {
  return runCommand('git describe --tags --abbrev=0', true);
}

/**
 * Get the default range for logs.
 * Falls back to `"all"` if no tags exist.
 *
 * @returns a range object `{from: latestTag, to: 'HEAD'}` or `'all'`
 */
export function getDefaultRange():
  | 'all'
  | {
      from: string;
      to: string;
    } {
  const latestTag = getLatestTag();
  return latestTag ? { from: latestTag, to: 'HEAD' } : 'all';
}

/**
 * Format a date string according to a custom format.
 *
 * @returns formatted string, or original input if parsing fails
 */
export function formatDateString(
  /**
   * ISO-like string or git date string
   */
  date: string,
  /**
   * Desired format ("YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY")
   */
  format: string | undefined,
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  switch (format) {
    case 'DD-MM-YYYY':
      return `${dd}-${mm}-${yyyy}`;
    case 'MM-DD-YYYY':
      return `${mm}-${dd}-${yyyy}`;
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Get Git log data with formatting support.
 *
 * @returns string (JSON, CSV, or Markdown) or `[]` if no commits found
 */
export default function getGitLog(
  /**
   * Configuration for fields, filters, and output formatting
   */
  options: LogOptions & FormatOptions = {
    fields: [
      'hash',
      'shortHash',
      'author',
      'email',
      'date',
      'formattedDate',
      'subject',
      'body',
    ],
    style: 'json',
    range: getDefaultRange(),
    delimiter: ',',
    mdStyle: 'block',
    pretty: true,
    limit: null,
    dateFormat: 'YYYY-MM-DD',
    branch: 'all',
  },
): string | never[] | undefined {
  let range = '';

  if (options.range === 'all') {
    range = '';
  } else if (options.range.from && options.range.to) {
    range = `${options.range.from}..${options.range.to}`;
  }

  const separator = '␞'; // ASCII Record Separator
  const rawFields = options.fields?.filter((f) => f !== 'formattedDate');
  const format = rawFields?.map((f) => FieldData[f]).join(separator);

  const args: string[] = ['log', `--pretty=format:${format}`];

  if (range && range !== 'all') {
    args.push(range);
  }
  if (options.limit) {
    args.push('-n', String(options.limit));
  }
  if (options.since) {
    args.push(`--since=${options.since}`);
  }
  if (options.until) {
    args.push(`--until=${options.until}`);
  }
  if (options.author) {
    args.push(`--author=${options.author}`);
  }
  if (options.branch && options.branch !== 'all') {
    args.push(options.branch);
  }

  const raw = runCommand('git', args);

  if (!raw) return [];

  const lines = raw.split('\n').map((line) => {
    const part: string[] = line.split(separator);
    const entry: Record<string, string> = {};

    rawFields?.forEach((field, index) => {
      entry[field] = part[index] || '';
    });

    if (options.fields?.includes('formattedDate')) {
      entry['formattedDate'] = formatDateString(
        entry['date'],
        options?.dateFormat,
      );
    }

    return entry;
  });

  if (options.style === 'json') {
    return options.pretty
      ? JSON.stringify(lines, null, 2)
      : JSON.stringify(lines);
  }

  if (options.style === 'csv') {
    const header = options.fields?.join(options.delimiter);
    const rows = lines.map((line) =>
      options.fields
        ?.map((f) => JSON.stringify(line[f] || ''))
        .join(options.delimiter || ','),
    );

    return [header, ...rows].join('\n');
  }

  if (options.style === 'md') {
    if (options.mdStyle === 'table') {
      const header = `| ${options.fields?.join(' | ')} |`;
      const divider = `| ${options.fields?.map(() => '---').join(' | ')} |`;
      const rows = lines.map(
        (c) => `| ${options.fields?.map((f) => c[f] || '').join(' | ')} |`,
      );
      return [header, divider, ...rows].join('\n');
    }

    if (options.mdStyle === 'list') {
      return lines
        .map(
          (c) =>
            `- ${options.fields?.map((f) => `**${f}**: ${c[f]}`).join(', ')}`,
        )
        .join('\n');
    }

    return lines
      .map((c) => options.fields?.map((f) => `**${f}**: ${c[f]}`).join('\n'))
      .join('\n\n');
  }
}
