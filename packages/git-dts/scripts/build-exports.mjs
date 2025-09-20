import fs from 'fs';
import path from 'path';

const ignoredFiles = ['index.d.ts', 'common.d.ts'];

fs.glob('*.d.ts', { cwd: './types', exclude: ignoredFiles }, (err, files) => {
  if (err) throw err;

  const common = fs.readFileSync(`./types/${ignoredFiles[1]}`, 'utf-8');

  const exports = files
    .map((f) => `export * from './${path.basename(f, '.d.ts')}'`)
    .join('\n');

  fs.writeFileSync(
    `./types/${ignoredFiles[0]}`,
    `${common}\n${exports}\n`,
    'utf-8',
  );

  console.log('Generated exports');
});
