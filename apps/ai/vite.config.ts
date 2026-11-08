import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/' + 'word',
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
  }
})

