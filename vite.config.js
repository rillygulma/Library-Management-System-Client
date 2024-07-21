// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // Specify the port number
    host: '0.0.0.0', // Expose the server to external network
  },
  // other configurations
});