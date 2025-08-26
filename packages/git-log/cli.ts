import { writeFileSync } from 'fs';
import { basename } from 'path';
import getGitLog, {
  FormatOptions,
  getLatestTag,
  GitField,
  LogOptions,
} from './index.js';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Usage: npx @tenedev/git-log [options]

Options:
  --fields <fields>        Comma-separated fields to include (hash, shortHash, author, email, date, subject, body)
                           Default: hash,shortHash,author,email,date,subject,body
  --limit <number>         Limit number of commits
  --range <range>          Git range ('all' or 'from..to')
                           Default: latest_tag..HEAD
  --branch <name>          Branch to read logs from (default: all branches)
  --since <date>           Filter commits since date (e.g., "2024-01-01")
  --until <date>           Filter commits until date (e.g., "2024-12-31")
  --author <name|email>    Filter commits by author
  --style <style>          Output style (json, csv, md)
                           Default: json
  --delimiter <char>       CSV delimiter (',' or ';')
                           Default: ,
  --md-style <style>       Markdown style (block, table, list)
                           Default: block
  --pretty                 Pretty-print JSON output
                           Default: true
  --no-pretty              Disable pretty-print JSON
  --output <filename>      Output filename (default: git-log-<dirname>.<extension>)
  --help                   Show this help message
`);
  process.exit(0);
}

if (args.includes('--help')) {
  printHelp();
}

const options: LogOptions & FormatOptions = {
  fields: ['hash', 'shortHash', 'author', 'email', 'date', 'subject', 'body'],
  style: 'json',
  range: { from: getLatestTag(), to: 'HEAD' },
  delimiter: ',',
  mdStyle: 'block',
  pretty: true,
  limit: null,
  since: undefined,
  until: undefined,
  author: undefined,
};

let outputFile = '';

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--fields': {
      const fields = args[++i]?.split(',') ?? [];
      options.fields = fields as GitField[];
      break;
    }
    case '--limit':
      options.limit = parseInt(args[++i] ?? '0', 10) || null;
      break;
    case '--range': {
      const range = args[++i];
      if (range === 'all') {
        options.range = 'all';
      } else if (range) {
        const [from, to] = range.split('..');
        options.range = { from, to: to || 'HEAD' };
      }
      break;
    }
    case '--since':
      options.since = args[++i];
      break;
    case '--until':
      options.until = args[++i];
      break;
    case '--author':
      options.author = args[++i];
      break;
    case '--style':
      options.style = args[++i] as 'json' | 'csv' | 'md';
      break;
    case '--delimiter':
      options.delimiter = args[++i] as ',' | ';';
      break;
    case '--md-style':
      options.mdStyle = args[++i] as 'block' | 'table' | 'list';
      break;
    case '--pretty':
      options.pretty = true;
      break;
    case '--no-pretty':
      options.pretty = false;
      break;
    case '--output':
      outputFile = args[++i] ?? '';
      break;
    case '--branch':
      options.branch = args[++i] ?? 'all';
      break;
  }
}

// Validate fields
const validFields: GitField[] = [
  'hash',
  'shortHash',
  'author',
  'email',
  'date',
  'subject',
  'formattedDate',
  'body',
];
if (options.fields?.some((f) => !validFields.includes(f))) {
  console.error('Error: Invalid field specified. Use --help for valid fields.');
  process.exit(1);
}

// Validate style
if (options.style && !['json', 'csv', 'md'].includes(options.style)) {
  console.error('Error: Invalid style. Use json, csv, or md.');
  process.exit(1);
}

// Validate mdStyle
if (
  options.style === 'md' &&
  options.mdStyle &&
  !['block', 'table', 'list'].includes(options.mdStyle)
) {
  console.error('Error: Invalid mdStyle. Use block, table, or list.');
  process.exit(1);
}

// Validate delimiter
if (
  options.style === 'csv' &&
  options.delimiter &&
  !([',', ';'] as string[]).includes(options.delimiter)
) {
  console.error('Error: Invalid delimiter. Use , or ;.');
  process.exit(1);
}

// Generate default filename if not provided
if (!outputFile) {
  const dirName = basename(process.cwd());
  const extension =
    options.style === 'json' ? 'json' : options.style === 'csv' ? 'csv' : 'md';
  outputFile = `git-log-${dirName}.${extension}`;
}

// Run getGitLog and save output
try {
  const result = getGitLog(options);
  if (Array.isArray(result)) {
    console.log('No git log data to output.');
  } else {
    writeFileSync(outputFile, result ?? '');
    console.log(`Output saved to ${outputFile}`);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error('Error generating git log:', error.message);
  } else {
    console.error('Error generating git log:', String(error));
  }
  process.exit(1);
}
