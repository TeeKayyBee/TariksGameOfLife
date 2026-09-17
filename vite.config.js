import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react' 
import { VitePWA } from 'vite-plugin-pwa' 

/**
 * Konfiguriert das Vite-Build-System und die Progressive Web App (PWA).
 * 
 * @remarks
 * Diese Konfiguration lädt das offizielle React-Plugin für Fast Refresh und 
 * registriert einen PWA Service Worker, der sich im Hintergrund automatisch aktualisiert.
 * Zudem wird das App-Manifest für die Installation auf Mobilgeräten definiert.
 * 
 * @see {@link https://vite.dev} für die Core-Dokumentation von Vite.
 * @see {@link https://netlify.app} für die Dokumentation des PWA-Plugins.
 */
export default defineConfig(
  { plugins: 
    [ react(), 
      VitePWA({ 
        registerType: 'autoUpdate', 
        manifest: { 
          name: "Tarik's Game of Life", 
          short_name: 'GameOfLife', 
          description: 'Conways Game of Life as interaktive Simulation', 
          theme_color: '#121212', 
          background_color: '#121212', 
          display: 'standalone', 
          icons: [ 
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, 
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' } 
          ] 
        } 
      }) 
    ],
    test: { environment: 'jsdom', globals: true, setupFiles: './src/test-setup.js', } 
  }
)