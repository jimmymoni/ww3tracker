/**
 * Share Panel Component
 * 
 * Features:
 * - Pre-populated share text
 * - Twitter/X sharing
 * - Copy to clipboard
 * - Reddit sharing
 * - Email sharing
 * - Generates OG image data
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Twitter, 
  Copy, 
  Check, 
  MessageSquare, 
  Mail,
  Link as LinkIcon,
  Share2
} from 'lucide-react';
import { generateShareText, formatNumber } from '../../utils/nuke';

export default function SharePanel({ city, warhead, casualties, onClose }) {
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState(null);
  
  // Generate share text
  const shareText = generateShareText(warhead, city, casualties);
  const shareUrl = 'https://ww3tracker.live/nuke';
  const fullShareText = `${shareText}\n${shareUrl}`;
  
  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Analytics
      if (window.gtag) {
        window.gtag('event', 'nuke_sim_copy');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [fullShareText]);
  
  // Share on Twitter/X
  const handleTwitterShare = useCallback(() => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    const hashtags = 'NuclearSimulator,WW3Tracker';
    
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`,
      '_blank',
      'width=600,height=400'
    );
    
    if (window.gtag) {
      window.gtag('event', 'nuke_sim_share_twitter');
    }
  }, [shareText, shareUrl]);
  
  // Share on Reddit
  const handleRedditShare = useCallback(() => {
    const title = encodeURIComponent(
      `[Educational] Simulated effects of ${warhead.name} nuclear weapon on ${city.name}: ${formatNumber(casualties.fatalities)} estimated fatalities. Nuclear weapons education matters.`
    );
    const url = encodeURIComponent(shareUrl);
    
    window.open(
      `https://www.reddit.com/submit?title=${title}&url=${url}`,
      '_blank'
    );
    
    if (window.gtag) {
      window.gtag('event', 'nuke_sim_share_reddit');
    }
  }, [warhead, city, casualties, shareUrl]);
  
  // Share via Email
  const handleEmailShare = useCallback(() => {
    const subject = encodeURIComponent(`[Educational] Nuclear Weapons Effects Simulation: ${warhead.name}`);
    const body = encodeURIComponent(fullShareText);
    
    window.open(
      `mailto:?subject=${subject}&body=${body}`,
      '_blank'
    );
    
    if (window.gtag) {
      window.gtag('event', 'nuke_sim_share_email');
    }
  }, [warhead, city, fullShareText]);
  
  // Web Share API (mobile)
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nuclear Weapons Effects Simulator - Educational',
          text: shareText,
          url: shareUrl
        });
        
        if (window.gtag) {
          window.gtag('event', 'nuke_sim_native_share');
        }
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  }, [shareText, shareUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-4 bottom-4 sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:right-0 sm:mt-4 z-50"
    >
      <div className="bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-lg mx-auto sm:max-w-none">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-red-400" />
            <span className="font-bold text-white">Share Results</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Preview Card */}
          <div className="bg-black/30 rounded-xl p-4 mb-4 border border-white/5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {warhead.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm">
                  {warhead.name} on {city.name}
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  💀 {formatNumber(casualties.fatalities)} fatalities
                  {' • '}
                  🏥 {formatNumber(casualties.injuries)} injuries
                </p>
                <div className="mt-2 text-xs text-gray-600">
                  ww3tracker.live
                </div>
              </div>
            </div>
          </div>
          
          {/* Share Text Preview */}
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-300 whitespace-pre-line">
              {shareText}
            </p>
          </div>
          
          {/* Share Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Twitter */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 transition-colors"
            >
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              <span className="text-[10px] text-gray-400">Twitter</span>
            </button>
            
            {/* Reddit */}
            <button
              onClick={handleRedditShare}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#FF4500]/10 hover:bg-[#FF4500]/20 border border-[#FF4500]/30 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-[#FF4500]" />
              <span className="text-[10px] text-gray-400">Reddit</span>
            </button>
            
            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Email</span>
            </button>
            
            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-[10px] text-gray-400">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
          
          {/* Native Share (mobile) */}
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-3 py-3 bg-red-800 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share via Device
            </button>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-black/20 border-t border-white/10 text-center">
          <p className="text-xs text-gray-600">
            Shares include link to ww3tracker.live with attribution
          </p>
        </div>
      </div>
    </motion.div>
  );
}
