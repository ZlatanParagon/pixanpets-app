import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cuatro apps en un mismo proyecto: PIXANPETS en `/`, AAE en `/aae.html`,
// ARSEG Tabletop en `/tabletop.html` y el Portal de Cliente en `/portal.html`.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        aae: 'aae.html',
        tabletop: 'tabletop.html',
        portal: 'portal.html',
      },
    },
  },
})
