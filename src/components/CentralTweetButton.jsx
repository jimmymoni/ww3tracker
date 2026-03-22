import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Camera, Share2, Link, Check, MessageCircle, Download } from 'lucide-react';

const CentralTweetButton = ({ usHP = 75, iranHP = 60 }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const hpSectionRef = useRef(null);

  const getShareText = () => {
    return `☢️ WW3 STANDOFF UPDATE\n\n🇺🇸 US: ${usHP}% HP vs 🇮🇷 Iran: ${iranHP}% HP\n\nWho's winning Round 1? 👀\n\nLive tracker 👇\nww3tracker.live #WW3 #USvsIran #TheStandoff`;
  };

  const shareToX = () => {
    const text = getShareText();
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
  };

  const shareToReddit = () => {
    const title = `WW3 Standoff: US ${usHP}% vs Iran ${iranHP}% - Who's winning?`;
    window.open(`https://reddit.com/submit?url=${encodeURIComponent('https://ww3tracker.live')}&title=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = `WW3 Standoff Update 🔥\n\nUS: ${usHP}% vs Iran: ${iranHP}%\n\nCheck it out: ww3tracker.live`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://ww3tracker.live');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const captureAndShare = async () => {
    setIsCapturing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      
      const hpSection = document.querySelector('#hp-section');
      if (!hpSection) {
        shareToX();
        return;
      }

      const canvas = await html2canvas(hpSection, {
        backgroundColor: '#0d0d12',
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200,
        width: hpSection.offsetWidth,
        height: hpSection.offsetHeight + 50
      });

      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            shareToX();
          } catch (err) {
            downloadScreenshot(canvas);
          }
        } else {
          downloadScreenshot(canvas);
        }
      });
    } catch (err) {
      console.error('Screenshot failed:', err);
      shareToX();
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadScreenshot = (canvas) => {
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.download = `ww3-standoff-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const quickScreenshot = async () => {
    setIsCapturing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const hpSection = document.querySelector('#hp-section');
      if (!hpSection) return;

      const canvas = await html2canvas(hpSection, {
        backgroundColor: '#0d0d12',
        scale: 2,
        useCORS: true,
        logging: false
      });

      downloadScreenshot(canvas);
    } catch (err) {
      console.error('Screenshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md mx-auto mb-4 sm:mb-6"
    >
      {/* Compact Share Row */}
      <div className="flex items-center justify-center gap-2">
        {/* Main Tweet Button - Smaller, Theme-Matched */}
        <motion.button
          onClick={captureAndShare}
          disabled={isCapturing}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-600/90 to-yellow-500/90 hover:from-yellow-500 hover:to-yellow-400 rounded-lg font-heading font-bold text-xs sm:text-sm text-black tracking-wide shadow-[0_0_20px_rgba(234,179,8,0.3)] border border-yellow-400/50 transition-all"
        >
          {isCapturing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full"
            />
          ) : (
            <Camera className="w-3.5 h-3.5" />
          )}
          <span>TWEET THIS</span>
          <Twitter className="w-3.5 h-3.5" />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Secondary Actions */}
        <motion.button
          onClick={quickScreenshot}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-yellow-400 transition-colors"
          title="Download screenshot"
        >
          <Download className="w-3.5 h-3.5" />
        </motion.button>

        <motion.button
          onClick={copyLink}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-green-400 transition-colors"
          title="Copy link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link className="w-3.5 h-3.5" />}
        </motion.button>

        <motion.button
          onClick={() => setShowShareOptions(!showShareOptions)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2.5 rounded-lg border transition-colors ${showShareOptions ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-red-400'}`}
          title="More share options"
        >
          <Share2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Expanded Share Options */}
      {showShareOptions && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mt-2"
        >
          <motion.button
            onClick={shareToReddit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded text-orange-400 text-xs transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Reddit</span>
          </motion.button>

          <motion.button
            onClick={shareToWhatsApp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs transition-colors"
          >
            <span className="text-xs font-bold">WA</span>
            <span>WhatsApp</span>
          </motion.button>

          <motion.button
            onClick={shareToX}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700/10 hover:bg-red-700/20 border border-red-700/30 rounded text-red-400 text-xs transition-colors"
          >
            <Twitter className="w-3 h-3" />
            <span>X / Twitter</span>
          </motion.button>
        </motion.div>
      )}

      {/* Subtle helper text */}
      <p className="text-[10px] text-gray-600 text-center mt-2">
        Auto-screenshot HP bars • One-click viral share
      </p>
    </motion.div>
  );
};

export default CentralTweetButton;
