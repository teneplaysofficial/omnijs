# @tenedev/git-log

_Parse and format git commit history with ease supporting filters for tags dates authors and ranges_

🪵 A lightweight **git log parser & formatter** for Node.js. Parse commit history into **JSON**, **CSV**, or **Markdown** — perfect for changelogs, release notes, or analytics. Supports filtering by tags, dates, authors, ranges, and works efficiently with large repositories.

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

After installation, you can run:

```bash
npx @tenedev/git-log --help
```

#### Example

```bash
# Export commits since the last tag as pretty JSON
npx @tenedev/git-log --style json --pretty --output changelog.json

# Export commits as CSV with custom delimiter
npx @tenedev/git-log --style csv --delimiter ";" --output commits.csv

# Generate a Markdown table with commits since Jan 2024
npx @tenedev/git-log --style md --md-style table --since "2024-01-01" --output commits.md
```

### Programmatic API

```ts
import getGitLog, {
  getLatestTag,
  GitField,
  LogOptions,
  FormatOptions,
} from '@tenedev/git-log';

// Example: commits since last tag
const log = getGitLog({
  fields: ['shortHash', 'author', 'date', 'subject'] as GitField[],
  style: 'md',
  mdStyle: 'table',
  range: { from: getLatestTag(), to: 'HEAD' },
  limit: 20,
});

console.log(log);
```

## Options

### `LogOptions`

| Option   | Type                                     | Default                                                         | Description                    |
| -------- | ---------------------------------------- | --------------------------------------------------------------- | ------------------------------ |
| `fields` | `GitField[]`                             | `['hash','shortHash','author','email','date','subject','body']` | Which commit fields to include |
| `limit`  | `number \| null`                         | `null`                                                          | Limit number of commits        |
| `range`  | `'all' \| { from: string; to?: string }` | `{ from: latestTag, to: 'HEAD' }`                               | Commit range to fetch          |
| `since`  | `string`                                 | `undefined`                                                     | Filter commits since date      |
| `until`  | `string`                                 | `undefined`                                                     | Filter commits until date      |
| `author` | `string`                                 | `undefined`                                                     | Filter commits by author       |

### `FormatOptions`

| Option      | Type                           | Default   | Description       |
| ----------- | ------------------------------ | --------- | ----------------- |
| `style`     | `'json' \| 'csv' \| 'md'`      | `'json'`  | Output format     |
| `delimiter` | `',' \| ';'`                   | `','`     | CSV delimiter     |
| `mdStyle`   | `'block' \| 'table' \| 'list'` | `'block'` | Markdown style    |
| `pretty`    | `boolean`                      | `true`    | Pretty-print JSON |

### `GitField`

- `hash` — full commit hash (40 chars)
- `shortHash` — short commit hash (7 chars)
- `author` — author name
- `email` — author email
- `date` — commit date
- `subject` — commit subject line
- `body` — commit body

## Examples

### JSON Output

```json
[
  {
    "shortHash": "a1b2c3d",
    "author": "Jane Doe",
    "date": "2024-08-10 12:00:00 +0000",
    "subject": "feat: add new API endpoint"
  }
]
```

#### CSV Output

```csv
shortHash,author,date,subject
a1b2c3d,"Jane Doe","2024-08-10 12:00:00 +0000","feat: add new API endpoint"
```

#### Markdown Table

```md
| shortHash | author   | date                      | subject                    |
| --------- | -------- | ------------------------- | -------------------------- |
| a1b2c3d   | Jane Doe | 2024-08-10 12:00:00 +0000 | feat: add new API endpoint |
```

## License

Released under the [Apache License 2.0](./LICENSE).
