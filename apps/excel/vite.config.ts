import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/' + 'excel',
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      'jszip': path.resolve(__dirname, '../word/node_modules/jszip'),
    }
  },
  server: {
    port: 5182,
    strictPort: true,
  },
  build: {
    outDir: 'dist/renderer',
  }
})