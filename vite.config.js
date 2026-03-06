import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    
    // Image optimization for production
    mode === 'production' && ViteImageOptimizer({
      png: { quality: 85 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      gif: { optimizationLevel: 2 },
      svg: {
        multipass: true,
        plugins: [
          'preset-default',
          'removeDimensions',
        ],
      },
    }),
    
    // Bundle analyzer for production builds (only when explicitly requested)
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  build: {
    // Enable source maps for debugging (can be disabled for production)
    sourcemap: mode !== 'production',
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk - third-party libraries
          vendor: ['react', 'react-dom', 'framer-motion'],
          // Icons chunk - separates lucide icons
          icons: ['lucide-react'],
          // Router chunk
          router: ['react-router-dom'],
          // Markdown rendering (heavy)
          markdown: ['react-markdown', 'remark-gfm'],
        },
        // Asset naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    
    // CSS optimization
    cssCodeSplit: true,
    
    // Target modern browsers for smaller bundles
    target: 'es2020',
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
}))
