import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [enhancedImages(), sveltekit(), nodePolyfills({ include: ['buffer'] })],
    server: {
      // https: {
      //   key: './certs/SSLforMyHosts-key.pem',
      //   cert: './certs/SSLforMyHosts-certificate.pem'
      // }
    }
  };
});
