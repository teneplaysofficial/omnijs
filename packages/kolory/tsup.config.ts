import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'kolory',
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  treeshake: true,
});
