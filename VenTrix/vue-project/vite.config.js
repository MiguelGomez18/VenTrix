import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  /*server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['330b-179-19-88-150.ngrok-free.app']
  },*/
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
