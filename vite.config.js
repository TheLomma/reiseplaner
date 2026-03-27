import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-180.png','icon-192.png','icon-512.png'],
      manifest: {
        name: 'Reiseplaner',
        short_name: 'Reiseplaner',
        description: 'Dein smarter Reiseplaner',
        theme_color: '#1e1a14',
        background_color: '#1e1a14',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-180.png', sizes: '180x180', type: 'image/png' }
        ]
      }
    })
  ]
})
