import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  splitting: false,
  minify: true,
  dts: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  treeshake: true,
});
