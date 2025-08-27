# @tenedev/git-log

_Parse and format git commit history with ease supporting filters for tags, dates, authors, and ranges_

[![npm](https://img.shields.io/npm/v/@tenedev/git-log.svg)](https://www.npmjs.com/package/@tenedev/git-log)
[![npm downloads](https://img.shields.io/npm/dw/@tenedev/git-log)](https://www.npmjs.com/package/@tenedev/git-log)

🪵 A lightweight **git log parser & formatter** for Node.js. Parse commit history into **JSON**, **CSV**, or **Markdown** — perfect for changelogs, release notes, or analytics. Supports filtering by tags, dates, authors, ranges, branches, and works efficiently with large repositories.

## Install

```bash
pnpm add -D @tenedev/git-log
# or
npm install -D @tenedev/git-log
# or
yarn add -D @tenedev/git-log
```

## Usage

### CLI

```bash
npx @tenedev/git-log --help
```

#### CLI Examples

```bash
# Export commits since the last tag as pretty JSON
npx @tenedev/git-log --style json --pretty --output changelog.json

# Export commits as CSV with custom delimiter
npx @tenedev/git-log --style csv --delimiter ";" --output commits.csv

# Generate a Markdown table with commits since Jan 2024
npx @tenedev/git-log --style md --md-style table --since "2024-01-01" --output commits.md

# Show only commits by a specific author on main branch
npx @tenedev/git-log --author "Alice" --branch main --style json

# Limit to 5 commits in short format
npx @tenedev/git-log --fields shortHash,subject --limit 5

# Show full history (ignoring tags)
npx @tenedev/git-log --range all
```

### Programmatic API

```ts
import getGitLog, {
  getLatestTag,
  getDefaultRange,
  GitField,
  LogOptions,
  FormatOptions,
} from '@tenedev/git-log';

// Example 1: commits since last tag in markdown
const log = getGitLog({
  fields: ['shortHash', 'author', 'date', 'subject'] as GitField[],
  style: 'md',
  mdStyle: 'table',
  range: { from: getLatestTag(), to: 'HEAD' },
  limit: 20,
});
console.log(log);

// Example 2: JSON logs across all history, custom date format
const jsonLog = getGitLog({
  fields: ['shortHash', 'formattedDate', 'subject'],
  style: 'json',
  pretty: true,
  range: 'all',
  dateFormat: 'DD-MM-YYYY',
});
console.log(jsonLog);

// Example 3: filter by author + date range
const filtered = getGitLog({
  fields: ['shortHash', 'author', 'date', 'subject'],
  style: 'csv',
  delimiter: ';',
  since: '2024-01-01',
  until: '2024-06-30',
  author: 'Bob',
});
console.log(filtered);
```

---

## Options

### `LogOptions`

| Option   | Type                                     | Default                                                         | Description                        |
| -------- | ---------------------------------------- | --------------------------------------------------------------- | ---------------------------------- |
| `fields` | `GitField[]`                             | `['hash','shortHash','author','email','date','subject','body']` | Commit fields to include           |
| `limit`  | `number \| null`                         | `null`                                                          | Limit number of commits            |
| `range`  | `'all' \| { from: string; to?: string }` | `{ from: latestTag, to: 'HEAD' }`                               | Commit range (`'all'` = full log)  |
| `since`  | `string`                                 | `undefined`                                                     | Filter commits since given date    |
| `until`  | `string`                                 | `undefined`                                                     | Filter commits until given date    |
| `author` | `string`                                 | `undefined`                                                     | Filter commits by author name/mail |
| `branch` | `string`                                 | `"all"`                                                         | Branch to scan commits from        |

### `FormatOptions`

| Option       | Type                                           | Default        | Description                       |
| ------------ | ---------------------------------------------- | -------------- | --------------------------------- |
| `style`      | `'json' \| 'csv' \| 'md'`                      | `'json'`       | Output format                     |
| `delimiter`  | `',' \| ';'`                                   | `','`          | CSV delimiter                     |
| `mdStyle`    | `'block' \| 'table' \| 'list'`                 | `'block'`      | Markdown rendering style          |
| `pretty`     | `boolean`                                      | `true`         | Pretty-print JSON                 |
| `dateFormat` | `'YYYY-MM-DD' \| 'DD-MM-YYYY' \| 'MM-DD-YYYY'` | `'YYYY-MM-DD'` | Custom format for `formattedDate` |

### `GitField`

- `hash` — full commit hash (40 chars)
- `shortHash` — short commit hash (7 chars)
- `author` — author name
- `email` — author email
- `date` — commit date (`git log --date=iso8601`)
- `formattedDate` — date formatted according to `dateFormat`
- `subject` — commit subject (first line)
- `body` — commit body (remaining lines)

## Example Outputs

### JSON

```json
[
  {
    "shortHash": "a1b2c3d",
    "author": "Jane Doe",
    "date": "2024-08-10T12:00:00+00:00",
    "formattedDate": "10-08-2024",
    "subject": "feat: add new API endpoint"
  }
]
```

### CSV

```csv
shortHash;author;date;subject
a1b2c3d;"Jane Doe";"2024-08-10T12:00:00+00:00";"feat: add new API endpoint"
```

### Markdown (list)

```md
- **shortHash**: a1b2c3d, **author**: Jane Doe, **subject**: feat: add new API endpoint
```

## **Edge cases**:

- Empty repository → returns `[]` (JSON) or empty string (CSV/MD).
- If no tag exists → `range` falls back to `'all'`.

## License

Released under the [Apache License 2.0](./LICENSE).
