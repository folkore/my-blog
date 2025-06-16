import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/my-blog/', // 添加基础路径配置
  plugins: [
    vue(),
    {
      name: 'vite-plugin-spa-fallback',
      /**
       * 在构建完成后，将 dist/index.html 复制为 dist/404.html。
       * 这样 GitHub Pages 在 404 场景下会回退到 SPA 的入口文件，
       * 前端路由即可接管并显示正确页面。
       */
      closeBundle() {
        const outDir = 'dist' // 与 build.outDir 保持一致
        const indexPath = path.resolve(__dirname, outDir, 'index.html')
        const notFoundPath = path.resolve(__dirname, outDir, '404.html')
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath)
          // eslint-disable-next-line no-console
          console.log('✅ 404.html 已生成 (SPA fallback)')
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // 允许通过 IP 访问
    port: 3000, // 设置启动端口为 3000
    open: true, // 自动打开浏览器
    cors: true, // 允许跨域
    proxy: {
      // 配置代理
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 分包配置
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  // 添加 raw 加载器配置
  assetsInclude: ['**/*.md'],
})
