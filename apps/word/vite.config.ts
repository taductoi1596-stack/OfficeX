import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/word',
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: [
      '@officex/ui',
      '@officex/icons',
      '@officex/editor-core',
      '@officex/document-engine',
      '@officex/command-engine',
      '@officex/history-engine',
      '@officex/object-model-engine',
      '@officex/cache-engine',
      '@officex/serialization-engine',
      '@officex/resource-engine',
      '@officex/input-engine',
      '@officex/event-engine',
      '@officex/hittest-engine',
      '@officex/viewport-engine',
      '@officex/coordinate-engine',
      '@officex/pagination-engine',
      '@officex/theme'
    ]
  },
  server: {
    port: 5181,
    strictPort: true
  },
  build: {
    outDir: 'dist/renderer',
  }
})
