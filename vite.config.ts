import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tres apps en un mismo proyecto: PIXANPETS en `/`, AAE en `/aae.html`
// y ARSEG Tabletop en `/tabletop.html`.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        aae: 'aae.html',
        tabletop: 'tabletop.html',
      },
    },
  },
})
