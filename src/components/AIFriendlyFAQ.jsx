import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

/**
 * AIFriendlyFAQ Component
 * 
 * Displays FAQs in a format optimized for AI citations (ChatGPT, Perplexity, etc.)
 * Uses question-format H2s and clear, concise answers that AI systems can easily extract.
 * 
 * @param {Array} faqs - Array of { question, answer } objects
 * @param {string} title - Section title (default: "Common Questions")
 * @param {string} className - Additional CSS classes
 */

// Default FAQs for the US-Iran conflict
export const DEFAULT_CONFLICT_FAQS = [
  {
    question: "How many casualties in the US-Iran war?",
    answer: "The US-Iran war has resulted in significant casualties on both sides since it began on March 17, 2026. Confirmed losses include Iranian military personnel from Israeli strikes in Tehran and Bandar Abbas, US casualties from Iranian missile attacks on regional bases, and civilian casualties in Tel Aviv, Beirut, and Baghdad. Exact casualty figures are updated as verification comes in from multiple sources."
  },
  {
    question: "What weapons is Iran using against Israel and the US?",
    answer: "Iran has deployed ballistic missiles including the Shahab-3 and Emad series, cruise missiles, and suicide drone swarms (primarily Shahed-136 and Shahed-131 models). These weapons have been used to strike Israeli cities, US military installations in Iraq and the Gulf states, and commercial shipping in the Persian Gulf."
  },
  {
    question: "Why did America attack Iran in 2026?",
    answer: "Direct US military involvement began on March 18, 2026, following Israeli precision strikes on senior Iranian leadership in Tehran. The US entered the conflict after Iran launched retaliatory missile strikes against both Israeli and American targets. The broader context involves decades of tensions over Iran's nuclear program, regional proxy conflicts, and the 2018 US withdrawal from the nuclear deal."
  },
  {
    question: "Is the Strait of Hormuz still open?",
    answer: "The Strait of Hormuz remains operational but highly volatile. This narrow waterway handles approximately 20% of global oil shipments (about 21 million barrels per day). Military activity in the region poses significant risks to international shipping and global energy markets. Multiple commercial vessels have been targeted or damaged since hostilities began."
  },
  {
    question: "What countries are supporting Iran?",
    answer: "Iran receives support from various proxy groups including Hezbollah in Lebanon, multiple Shia militia groups in Iraq and Syria, and the Houthi movement in Yemen. Syria provides territorial access. However, as of March 2026, no major nation-state has entered the conflict directly alongside Iran. Russia and China have called for de-escalation but remain officially uninvolved."
  },
  {
    question: "Will the US-Iran war cause World War 3?",
    answer: "While the conflict represents the most serious Middle East escalation in decades, World War 3 would require direct military involvement of multiple major powers (Russia, China, NATO). Currently, the conflict remains regional with proxy involvement. However, the risk of broader escalation exists if other nations are drawn in or if nuclear facilities are targeted."
  },
  {
    question: "How did the US-Iran war start?",
    answer: "The war began on March 17, 2026, when Israel conducted surprise precision airstrikes targeting senior Iranian leadership in Tehran. Iran immediately retaliated with ballistic missile strikes against Israel. The United States entered the conflict within 24 hours with strikes on Iranian military targets at Bandar Abbas."
  },
  {
    question: "Where is the US-Iran war being fought?",
    answer: "Major combat zones include: Tehran and Bandar Abbas (Iran); Tel Aviv and Jerusalem area (Israel); Beirut and Tyre (Lebanon); Baghdad (Iraq); and various locations across the Persian Gulf. The conflict has also extended into cyberspace and affected commercial shipping lanes throughout the region."
  }
];

// FAQ data formatted for JSON-LD schema
export const getFAQSchemaData = (faqs = DEFAULT_CONFLICT_FAQS) => {
  return faqs.map(({ question, answer }) => ({
    question,
    answer
  }));
};

const AIFriendlyFAQ = ({ 
  faqs = DEFAULT_CONFLICT_FAQS, 
  title = "Frequently Asked Questions",
  icon: Icon = AlertCircle,
  className = "",
  columns = 2
}) => {
  return (
    <section className={`mt-16 pt-12 border-t border-white/10 ${className}`}>
      <div className="flex items-center gap-3 mb-8">
        <Icon className="w-6 h-6 text-red-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {title}
        </h2>
      </div>
      
      <div className={`grid ${columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {faqs.map((faq, index) => (
          <article 
            key={index} 
            className="bg-[#14141c] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors ai-citation"
            itemScope
            itemType="https://schema.org/Question"
          >
            <h3 
              className="text-lg font-semibold text-white mb-3"
              itemProp="name"
            >
              {faq.question}
            </h3>
            <div 
              className="text-gray-400 text-sm leading-relaxed faq-answer"
              itemScope
              itemType="https://schema.org/Answer"
              itemProp="acceptedAnswer"
            >
              <div itemProp="text">
                {faq.answer}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

/**
 * CompactFAQ - Smaller version for sidebars or constrained spaces
 */
export const CompactFAQ = ({ 
  faqs = DEFAULT_CONFLICT_FAQS.slice(0, 4),
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <details 
          key={index} 
          className="bg-[#14141c] border border-white/10 rounded-lg group ai-citation"
        >
          <summary className="p-4 cursor-pointer font-medium text-white hover:text-red-400 transition-colors list-none flex items-center justify-between">
            <span>{faq.question}</span>
            <HelpCircle className="w-4 h-4 text-gray-500 group-open:text-red-400 transition-colors" />
          </summary>
          <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed faq-answer">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
};

/**
 * QuestionCard - Individual question component for inline use
 */
export const QuestionCard = ({ question, answer, className = "" }) => (
  <div className={`bg-[#14141c] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors ai-citation ${className}`}>
    <h3 className="text-lg font-semibold text-white mb-3">
      {question}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed faq-answer">
      {answer}
    </p>
  </div>
);

export default AIFriendlyFAQ;
