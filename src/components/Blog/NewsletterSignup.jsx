import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check, AlertCircle } from 'lucide-react';

const NewsletterSignup = ({ variant = 'inline' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Mail className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Stay Informed</h3>
            <p className="text-zinc-500 text-sm">Get updates delivered to your inbox</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">You're subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 text-sm"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {status === 'loading' ? '...' : <Send className="w-4 h-4" />}
            </button>
          </form>
        )}

        <p className="text-xs text-zinc-600 mt-3 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          No spam, unsubscribe anytime.
        </p>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Mail className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Get updates</h3>
            <p className="text-xs text-zinc-500">Weekly analysis in your inbox</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-400 ml-auto">
            <Check className="w-4 h-4" />
            <span className="text-sm">Subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 md:ml-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 text-sm"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Join'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default NewsletterSignup;
