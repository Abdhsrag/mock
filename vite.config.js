import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Recharts is loaded from the neighboring dashboard's node_modules.
    // Force it and the mock UI to share one React runtime.
    dedupe: ['react', 'react-dom'],
    alias: [
      // Force every package, including the linked chart library, onto the mock's React copy.
      { find: 'react-dom', replacement: path.resolve(__dirname, 'node_modules/react-dom') },
      { find: 'react', replacement: path.resolve(__dirname, 'node_modules/react') },
      // Keep mock charts on the same Recharts version installed by my-dashboard.
      { find: 'recharts', replacement: path.resolve(__dirname, '../my-dashboard/node_modules/recharts') },
    ],
  },
  server: { host: '0.0.0.0' },
});
