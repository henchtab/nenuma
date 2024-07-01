import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [enhancedImages(), sveltekit(), nodePolyfills({ include: ['buffer'] }), mkcert()],
});
