import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Eagerly load critical components
import App from './App.jsx'

// Remove initial loader once React starts rendering
const removeInitialLoader = () => {
  const loader = document.getElementById('initial-loader')
  if (loader) {
    loader.style.opacity = '0'
    loader.style.transition = 'opacity 0.3s ease'
    setTimeout(() => loader.remove(), 300)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App onMounted={removeInitialLoader} />
  </React.StrictMode>,
)

// Remove loader immediately as App renders
removeInitialLoader()

// Dispatch render event for prerendering (SEO)
// This tells vite-plugin-prerender that the page is ready
setTimeout(() => {
  document.dispatchEvent(new Event('render-event'))
}, 2000)
