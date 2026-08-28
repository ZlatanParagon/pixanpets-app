import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build de un solo entry (tabletop) para empaquetado autocontenido.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-artifact',
    rollupOptions: { input: { tabletop: 'tabletop.html' } },
  },
})
