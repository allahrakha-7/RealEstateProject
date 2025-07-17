import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: "https://your-backend.up.railway.app",
        secure: false,
      },
    },
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
})
