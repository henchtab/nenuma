import { config } from "dotenv";
import { build } from "esbuild";
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";

config({
  path: ".env.sentry-build-plugin",
});

if (!process.env.SENTRY_AUTH_TOKEN) {
  throw new Error(
    "Did you forget to set SENTRY_AUTH_TOKEN? Make sure that .env.sentry-build-plugin exists and contains SENTRY_AUTH_TOKEN",
  );
}

try {
  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "esm",
    splitting: false,
    packages: "external",
    minify: true,
    sourcemap: true,
    outdir: "dist",
    platform: "node",
    plugins: [
      sentryEsbuildPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "vlad-chuchupak",
        project: "nenuma-api",
        debug: true,
      }),
    ],
  });
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}

// export default defineConfig({
//   entry: ['src/*.ts'],
//   format: 'esm',
//   splitting: false,
//   minify: true,
//   dts: false,
//   sourcemap: true,
//   clean: true,
//   outDir: 'dist',
//   esbuildPlugins: [
//     sentryEsbuildPlugin({
//       authToken: process.env.SENTRY_AUTH_TOKEN,
//       org: 'vlad-chuchupak',
//       project: 'nenuma-api',
//       sourcemaps: {
//         assets: ['dist/index.js.map', 'dist/index.js'],
//       },
//       debug: true,
//     }),
//   ],
// });
