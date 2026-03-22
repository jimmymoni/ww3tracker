import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const QuoteBlock = ({ quote, author, role, source, variant = 'default' }) => {
  const variants = {
    default: 'border-l-4 border-red-500 bg-red-500/5',
    warning: 'border-l-4 border-orange-500 bg-orange-500/5',
    danger: 'border-l-4 border-red-500 bg-red-500/5',
    success: 'border-l-4 border-green-500 bg-green-500/5',
  };

  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`relative my-8 p-6 rounded-r-xl ${variants[variant]}`}
    >
      <Quote className="absolute top-4 right-4 w-8 h-8 text-white/10" />
      
      <p className="text-lg md:text-xl text-white font-medium leading-relaxed italic mb-4">
        "{quote}"
      </p>
      
      <footer className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
          {author.charAt(0)}
        </div>
        <div>
          <cite className="not-italic text-white font-semibold">{author}</cite>
          {role && <p className="text-sm text-gray-400">{role}</p>}
          {source && <p className="text-xs text-gray-500">{source}</p>}
        </div>
      </footer>
    </motion.blockquote>
  );
};

export default QuoteBlock;
