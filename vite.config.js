// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // Specify the port your app should listen on
  },
  build: {
    outDir: 'dist',
  },
});
