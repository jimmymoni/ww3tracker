import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

const FAQ = ({ questions, title = "Frequently Asked Questions" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
    >
      <div className="p-5 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-zinc-400" />
          {title}
        </h3>
      </div>

      <div className="divide-y divide-zinc-800">
        {questions.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/20 transition-colors"
            >
              <span className="text-zinc-200 font-medium pr-4">{item.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className={`w-5 h-5 transition-colors ${
                  openIndex === index ? 'text-red-400' : 'text-zinc-500'
                }`} />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4">
                    <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                        <p className="text-zinc-400 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FAQ;
