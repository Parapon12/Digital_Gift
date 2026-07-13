import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages: set VITE_BASE=/Digital_Gift/ in CI; local/dev stays /
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
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
