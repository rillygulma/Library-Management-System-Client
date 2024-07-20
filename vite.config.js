// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,  // Optional: helps with debugging
  },
  server: {
    port: 3000,       // Adjust as needed
  },
});
