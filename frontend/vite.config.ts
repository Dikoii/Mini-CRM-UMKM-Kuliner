import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/customers': 'http://localhost:3001',
      '/orders': 'http://localhost:3001',
    },
  },
})
