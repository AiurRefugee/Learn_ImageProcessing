import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@use "@/styles/index.scss" as *;`,
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: ['127.0.0.1', '0.0.0.0'],
    // host: '127.0.0.1',
    port: 1146,
    https: {

      key: 'mydomain.key',
      cert: 'mydomain.crt',
    }
  }
})
