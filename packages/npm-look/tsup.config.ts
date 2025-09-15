import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['index.ts'],
    dts: true,
    minify: true,
    format: ['esm', 'cjs'],
    clean: true,
  },
  {
    entry: ['cli.ts'],
    minify: true,
    format: ['cjs'],
    banner: { js: '#!/usr/bin/env node' },
  },
]);
