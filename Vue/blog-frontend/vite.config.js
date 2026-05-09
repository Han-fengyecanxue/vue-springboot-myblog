import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: { // <--- 添加此 server 配置块
    host: '0.0.0.0', // 1. 监听所有地址，允许外部访问
    allowedHosts: [
      '.takin.cc' // 2. 信任所有以 .takin.cc 结尾的域名
    ],
    // port: 5173, // (可选) 显式指定端口，默认是 5173，通常无需修改
  },
})