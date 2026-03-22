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
        // IMPORTANT: React and all React-dependent libraries must be in the same chunk
        // to avoid "Cannot read properties of null (reading 'useState')" errors
        // caused by duplicate React instances
        manualChunks: {
          // Vendor chunk - ALL React-related libraries MUST be together
          // react, react-dom, react-router-dom, framer-motion, lucide-react, and react-markdown
          // are interdependent and must share the same React instance to avoid
          // "Cannot read properties of null (reading 'useState')" errors
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom', 
            'framer-motion',
            'lucide-react',
            'react-markdown',
            'remark-gfm',
            'react-helmet-async'
          ],
          // Map libraries (heavy) - only loaded when map is shown (no React dependency)
          maps: ['d3', 'd3-geo', 'topojson-client'],
          // Data fetching and utilities (no React dependency)
          utils: ['node-fetch', 'xml2js'],
        },
        // Asset naming for better caching with content hash
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        // Add build timestamp to force cache refresh on deploy
        banner: `/* WW3 Tracker Build: ${new Date().toISOString()} */`,
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
  // Include all React-related libraries to ensure they're pre-bundled together
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'framer-motion', 
      'lucide-react',
      'react-markdown',
      'remark-gfm',
      'react-helmet-async',
      'react-router-dom'
    ],
  },
}))
