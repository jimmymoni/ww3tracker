// THIS IS AN UPDATED vite.config.js WITH PRERENDERING FOR SEO
// Copy this to your vite.config.js (or rename and replace)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// Try to import prerender plugin
// If not installed, run: npm install -D vite-plugin-prerender
let prerender;
try {
  prerender = require('vite-plugin-prerender');
} catch (e) {
  console.warn('⚠️  vite-plugin-prerender not installed. SEO will be limited.');
  console.warn('   Run: npm install -D vite-plugin-prerender');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    
    // Prerender plugin for SEO (generates static HTML for each route)
    prerender && prerender.default({
      staticDir: path.join(__dirname, 'dist'),
      routes: [
        '/',                                    // Homepage
        '/blog',                                // Blog listing
        '/ww3-probability',                     // Landing page
        '/us-iran-war-tracker',                 // Landing page
        '/iran-conflict-live',                  // Landing page
        '/timeline',                            // Timeline page
        '/ww3-risk-calculator',                 // Calculator page
        // Blog posts - add more as you create them
        '/blog/why-america-fighting-iran',
        '/blog/us-vs-iran-military',
        '/blog/israel-iran-war',
        '/blog/iran-nuclear-program',
        '/blog/strait-hormuz-oil',
        '/blog/what-happens-next',
        // Add new blog posts here
      ],
      
      // Options for puppeteer (the browser used for prerendering)
      rendererOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
      
      // Wait for specific element before capturing
      renderAfterElementExists: '#root',
      
      // Timeout for rendering (in ms)
      renderAfterTime: 5000,
    }),
    
    // Bundle analyzer for production builds
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
