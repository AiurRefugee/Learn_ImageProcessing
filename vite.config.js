import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: ['127.0.0.1', '192.168.2.77', '192.168.3.127'],
    https: {

      key: 'mydomain.key',
      cert: 'mydomain.crt',
    }
  }
})
