import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  dts: true,
  minify: true,
  format: ['esm', 'cjs'],
  clean: true,
});
