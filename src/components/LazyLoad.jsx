import { useState, useEffect, useRef } from 'react';

/**
 * LazyLoad component - delays rendering children until scrolled into viewport
 * Reduces initial JS execution and improves TTI
 */
export default function LazyLoad({ 
  children, 
  fallback = null,
  rootMargin = '100px', // Start loading 100px before visible
  threshold = 0.1 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Disconnect after loading
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Simple skeleton loader fallback
export function SkeletonLoader({ height = '200px', className = '' }) {
  return (
    <div 
      className={`bg-white/5 rounded-xl animate-pulse ${className}`}
      style={{ height }}
    />
  );
}
