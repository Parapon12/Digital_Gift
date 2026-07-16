import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages: set VITE_BASE=/Digital_Gift/ in CI; local/dev stays /
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    // Stable entry names so phones/PCs sharing the same Pages URL don't break
    // when a redeploy changes content-hashed filenames.
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''
          if (name.endsWith('.css')) return 'assets/app.css'
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
  server: {
    host: true, // allow phone/tablet on the same Wi‑Fi
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
