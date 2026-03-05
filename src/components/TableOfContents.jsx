import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const TableOfContents = ({ sections, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-orange-500"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
        />
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
      >
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Menu className="w-4 h-4" />
          Contents
        </h3>
        
        <nav className="space-y-1">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-medium ${
                  activeSection === section.id
                    ? 'bg-red-500 text-white'
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {index + 1}
                </span>
                <span className="truncate">{section.title}</span>
              </span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-full shadow-lg flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-zinc-300" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-zinc-950 border-l border-zinc-800 z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Contents</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <nav className="space-y-1">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${
                        activeSection === section.id
                          ? 'bg-red-500 text-white'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span>{section.title}</span>
                      {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableOfContents;
