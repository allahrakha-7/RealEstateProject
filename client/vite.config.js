import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import lineClamp from '@tailwindcss/line-clamp'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  plugins: [
    tailwindcss(),
    lineClamp,
    react(),
  ],
})
