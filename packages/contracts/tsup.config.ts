import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['wrappers/index.ts'],
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: true,
  minify: true,
  target: 'node18',
});
