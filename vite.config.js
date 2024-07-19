import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Use the PORT environment variable or default to 3000
    strictPort: true, // Fail if the port is already in use
    host: '0.0.0.0' // Listen on all addresses, needed for Render
  },
  build: {
    outDir: 'dist'
  }
});
