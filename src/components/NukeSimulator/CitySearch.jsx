/**
 * City Search Component with Autocomplete
 * 
 * Features:
 * - Real-time search across 150+ cities
 * - Keyboard navigation (up/down/enter)
 * - Click outside to close
 * - Featured cities quick select
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Locate, X } from 'lucide-react';
import { CITIES, FEATURED_CITIES, searchCities } from '../../data/cities';

export default function CitySearch({ selectedCity, onSelect }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Update search results when query changes
  useEffect(() => {
    if (query.length > 0) {
      const searchResults = searchCities(query);
      setResults(searchResults);
      setHighlightedIndex(-1);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          selectCity(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, highlightedIndex]);

  const selectCity = (city) => {
    onSelect(city);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  // Try to get user's location
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Find nearest city
        const { latitude, longitude } = position.coords;
        let nearestCity = CITIES[0];
        let minDistance = Infinity;

        CITIES.forEach(city => {
          const distance = Math.sqrt(
            Math.pow(city.lat - latitude, 2) + 
            Math.pow(city.lng - longitude, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
          }
        });

        onSelect(nearestCity);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocating(false);
        alert('Could not get your location');
      }
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : selectedCity.name}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setQuery('');
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search any city..."
          className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
        <button
          onClick={handleLocate}
          disabled={isLocating}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-400 transition-colors disabled:opacity-50"
          title="Use my location"
        >
          <Locate className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a24] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {query.length > 0 ? (
              // Search results
              results.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto py-2">
                  {results.map((city, index) => (
                    <li
                      key={`${city.name}-${city.country}`}
                      onClick={() => selectCity(city)}
                      className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                        index === highlightedIndex 
                          ? 'bg-blue-500/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-white font-medium">{city.name}</div>
                          <div className="text-gray-500 text-xs">{city.country}</div>
                        </div>
                      </div>
                      <div className="text-gray-600 text-xs">
                        {city.population >= 1000000 
                          ? `${(city.population / 1000000).toFixed(1)}M` 
                          : `${(city.population / 1000).toFixed(0)}K`
                        }
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No cities found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )
            ) : (
              // Featured cities when no search
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Popular Cities
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {FEATURED_CITIES.slice(0, 8).map((city) => (
                    <li
                      key={`featured-${city.name}`}
                      onClick={() => selectCity(city)}
                      className="px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-white font-medium">{city.name}</div>
                          <div className="text-gray-500 text-xs">{city.country}</div>
                        </div>
                      </div>
                      <div className="text-gray-600 text-xs">
                        {city.population >= 1000000 
                          ? `${(city.population / 1000000).toFixed(1)}M` 
                          : `${(city.population / 1000).toFixed(0)}K`
                        }
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected City Display (when dropdown closed) */}
      {!isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-2 text-sm text-gray-400"
        >
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>{selectedCity.name}, {selectedCity.country}</span>
          <span className="text-gray-600">•</span>
          <span>Pop: {(selectedCity.population / 1000000).toFixed(1)}M</span>
        </motion.div>
      )}
    </div>
  );
}
