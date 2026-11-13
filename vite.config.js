import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // base: '/nome-do-repo/',   // descomente se publicar em um subcaminho (ex.: GitHub Pages)
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // baixa versões novas sozinho e atualiza no próximo uso
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'わたしの文法ノート · treino de gramática',
        short_name: '文法ノート',
        description: 'Treino de gramática japonesa (Dekiru Nihongo Shokyū).',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#3d6b8c',
        background_color: '#e9eeea',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'], // o app inteiro fica disponível offline
        runtimeCaching: [
          // A fonte Zen Maru Gothic vem do Google Fonts: é guardada no primeiro acesso
          { urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, handler: 'StaleWhileRevalidate', options: { cacheName: 'google-fonts-css' } },
          { urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i, handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-files', expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } } },
        ],
      },
    }),
  ],
})
