import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wb': {
        target: 'https://a.windbornesystems.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/wb/, '')
      }
    }
  }
})


