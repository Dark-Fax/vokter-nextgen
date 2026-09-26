import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas para que el bundle empaquetado en Capacitor resuelva los
  // assets sin depender de que la app se sirva desde la raíz del dominio.
  base: './',
  plugins: [react(), tailwindcss()],
})
