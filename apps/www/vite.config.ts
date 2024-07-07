import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    enhancedImages(),
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN
      },
      adapter: 'node',
    }),
    sveltekit(),
    nodePolyfills({ include: ['buffer'] })
  ]
});
