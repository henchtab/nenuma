import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [enhancedImages(), sveltekit()],
    server: {
      https: {
        key: './certs/SSLforMyHosts-key.pem',
        cert: './certs/SSLforMyHosts-certificate.pem'
      }
    }
  };
});
