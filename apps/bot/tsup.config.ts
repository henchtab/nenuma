import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bot.ts'],
  format: 'esm',
  clean: true,
  dts: false,
  minify: true,
  outDir: 'dist',
});
