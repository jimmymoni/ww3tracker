import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Check,
  Share2,
  X
} from 'lucide-react';

/**
 * ShareButtons - Floating social share buttons
 * 
 * @param {Object} props
 * @param {string} props.url - URL to share
 * @param {string} props.title - Title to share
 * @param {string} props.description - Description for sharing
 * @param {boolean} props.floating - Whether to use sticky/floating position
 * @param {string} props.position - Position when floating: 'left' | 'right'
 * @param {string} props.className - Additional CSS classes
 */
const ShareButtons = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = '',
  description = '',
  floating = false,
  position = 'right',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500 hover:text-white hover:border-sky-500',
      bgColor: 'bg-slate-800',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-red-700 hover:text-white hover:border-red-700',
      bgColor: 'bg-slate-800',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-red-800 hover:text-white hover:border-red-800',
      bgColor: 'bg-slate-800',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Floating/Sticky Version
  if (floating) {
    return (
      <>
        {/* Desktop Floating Sidebar */}
        <motion.aside
          className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-40 flex-col gap-2 ${
            position === 'left' ? 'left-6' : 'right-6'
          } ${className}`}
          initial={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {shareLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative w-10 h-10 rounded-full border border-slate-700 ${link.bgColor} ${link.color} flex items-center justify-center transition-all duration-300`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              <link.icon className="w-4 h-4" />
              
              {/* Tooltip */}
              <span className={`absolute ${position === 'left' ? 'left-full ml-2' : 'right-full mr-2'} px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-slate-700`}>
                Share on {link.name}
              </span>
            </motion.a>
          ))}

          {/* Copy Link Button */}
          <motion.button
            onClick={handleCopyLink}
            className={`group relative w-10 h-10 rounded-full border border-slate-700 ${
              copied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
            } flex items-center justify-center transition-all duration-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            
            {/* Tooltip */}
            <span className={`absolute ${position === 'left' ? 'left-full ml-2' : 'right-full mr-2'} px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-slate-700`}>
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </motion.button>
        </motion.aside>

        {/* Mobile Floating Button */}
        <div className="lg:hidden">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-red-800 text-white shadow-lg shadow-red-600/30 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="share"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Share Menu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="fixed bottom-24 right-6 z-40 flex flex-col gap-2"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {[...shareLinks, { name: 'Copy', icon: copied ? Check : Link2, onClick: handleCopyLink }].map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className={`w-10 h-10 rounded-full border ${
                          copied 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        } flex items-center justify-center shadow-lg`}
                      >
                        <link.icon className="w-4 h-4" />
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full border border-slate-700 ${link.bgColor} ${link.color} flex items-center justify-center shadow-lg`}
                      >
                        <link.icon className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  }

  // Inline Version
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-slate-500 text-sm mr-2">Share:</span>
      
      {shareLinks.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative w-9 h-9 rounded-lg border border-slate-700 ${link.bgColor} ${link.color} flex items-center justify-center transition-all duration-300`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <link.icon className="w-4 h-4" />
          
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-slate-700">
            {link.name}
          </span>
        </motion.a>
      ))}

      {/* Copy Link Button */}
      <motion.button
        onClick={handleCopyLink}
        className={`group relative w-9 h-9 rounded-lg border ${
          copied 
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
        } flex items-center justify-center transition-all duration-300`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        
        {/* Tooltip */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-slate-700">
          {copied ? 'Copied!' : 'Copy Link'}
        </span>
      </motion.button>
    </motion.div>
  );
};

export default ShareButtons;
