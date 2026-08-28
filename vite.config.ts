import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dos apps en un mismo proyecto: PIXANPETS en `/` y AAE en `/aae.html`.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        aae: 'aae.html',
      },
    },
  },
})
