import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
    },
},
  server: {
    proxy: {
      '/api': {
        target: 'https://mock-backend-32tp.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})