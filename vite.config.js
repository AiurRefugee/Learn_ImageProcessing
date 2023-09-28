import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // mkcert()
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
    host: ['127.0.0.1'],
    hmr: true,
    // host: '127.0.0.1',
    port: 1146,
    // https: { 
    //   key: 'mydomain.key',
    //   cert: 'mydomain.crt',
    // } 
    // https: true
  }
})
