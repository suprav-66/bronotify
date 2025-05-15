import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // ✅ for Vercel
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bronotify',
        short_name: 'Bronotify',
        description: 'Task reminder app',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/vite.svg',  // ✅ correct for Vercel root
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
});
