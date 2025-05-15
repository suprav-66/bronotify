import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';  // Correct named import
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // This should be set if deploying to a subpath like on GitHub Pages
 // Update this to your project's base path
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bronotify',
        short_name: 'Bronotify',
        description: 'Task reminder app',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/bronotify/vite.svg',  // Path to icon
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
});
