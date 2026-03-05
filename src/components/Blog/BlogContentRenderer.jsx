import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slugify function for creating anchor IDs
const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Parse inline formatting: bold, italic, links, code
const parseInlineFormatting = (text) => {
  if (!text) return text;

  const parts = [];
  let lastIndex = 0;
  const regex = /(\*\*|\*|__|_|`|\[([^\]]+)\]\(([^)]+)\))/g;
  let match;

  const processMatch = (matchedText, start, end) => {
    if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      const content = matchedText.slice(2, -2);
      return (
        <strong key={start} className="font-bold text-sky-300">
          {parseInlineFormatting(content)}
        </strong>
      );
    } else if (matchedText.startsWith('*') && matchedText.endsWith('*') && !matchedText.startsWith('**')) {
      const content = matchedText.slice(1, -1);
      return (
        <em key={start} className="italic text-gray-300">
          {parseInlineFormatting(content)}
        </em>
      );
    } else if (matchedText.startsWith('__') && matchedText.endsWith('__')) {
      const content = matchedText.slice(2, -2);
      return (
        <strong key={start} className="font-bold text-sky-300">
          {parseInlineFormatting(content)}
        </strong>
      );
    } else if (matchedText.startsWith('_') && matchedText.endsWith('_') && !matchedText.startsWith('__')) {
      const content = matchedText.slice(1, -1);
      return (
        <em key={start} className="italic text-gray-300">
          {parseInlineFormatting(content)}
        </em>
      );
    } else if (matchedText.startsWith('`') && matchedText.endsWith('`') && !matchedText.startsWith('```')) {
      const content = matchedText.slice(1, -1);
      return (
        <code
          key={start}
          className="px-1.5 py-0.5 text-sm font-mono bg-slate-800 text-sky-300 rounded border border-slate-700"
        >
          {content}
        </code>
      );
    } else if (matchedText.startsWith('[')) {
      const linkMatch = matchedText.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        return (
          <a
            key={start}
            href={url}
            className="text-sky-400 hover:text-sky-300 transition-colors duration-200 underline underline-offset-2 decoration-sky-500/50 hover:decoration-sky-400"
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {parseInlineFormatting(label)}
          </a>
        );
      }
    }
    return matchedText;
  };

  // Simple recursive parser for nested formatting
  const parseText = (input) => {
    // First handle code (non-greedy)
    let result = input;
    
    // Handle bold with **
    result = result.replace(/\*\*([^*]+)\*\*/g, '<BOLD>$1</BOLD>');
    // Handle italic with *
    result = result.replace(/\*([^*]+)\*/g, '<ITALIC>$1</ITALIC>');
    // Handle code with `
    result = result.replace(/`([^`]+)`/g, '<CODE>$1</CODE>');
    // Handle links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<LINK href="$2">$1</LINK>');

    // Split and reconstruct
    const elements = [];
    const parts = result.split(/<(BOLD|ITALIC|CODE|LINK)[^>]*>([^<]*)<\/\1>|<(LINK)[^>]*href="([^"]*)"[^>]*>([^<]*)<\/\3>/g);
    
    let i = 0;
    while (i < parts.length) {
      if (!parts[i]) {
        i++;
        continue;
      }
      
      if (parts[i] === 'BOLD' && parts[i + 1]) {
        elements.push(
          <strong key={i} className="font-bold text-sky-300">
            {parseText(parts[i + 1])}
          </strong>
        );
        i += 2;
      } else if (parts[i] === 'ITALIC' && parts[i + 1]) {
        elements.push(
          <em key={i} className="italic text-gray-300">
            {parseText(parts[i + 1])}
          </em>
        );
        i += 2;
      } else if (parts[i] === 'CODE' && parts[i + 1]) {
        elements.push(
          <code
            key={i}
            className="px-1.5 py-0.5 text-sm font-mono bg-slate-800 text-sky-300 rounded border border-slate-700"
          >
            {parts[i + 1]}
          </code>
        );
        i += 2;
      } else if (parts[i] === 'LINK' && parts[i + 2]) {
        const href = parts[i + 1];
        const label = parts[i + 2];
        elements.push(
          <a
            key={i}
            href={href}
            className="text-sky-400 hover:text-sky-300 transition-colors duration-200 underline underline-offset-2 decoration-sky-500/50 hover:decoration-sky-400"
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {parseText(label)}
          </a>
        );
        i += 3;
      } else {
        // Regular text - check for HTML entities
        const text = parts[i]
          .replace(/<\/BOLD>/g, '')
          .replace(/<\/ITALIC>/g, '')
          .replace(/<\/CODE>/g, '')
          .replace(/<\/LINK>/g, '');
        if (text) {
          elements.push(<span key={i}>{text}</span>);
        }
        i++;
      }
    }
    
    return elements.length === 1 ? elements[0] : elements;
  };

  return parseText(text);
};

// Parse content into structured blocks
const parseContent = (content) => {
  if (!content) return [];

  const lines = content.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Empty line
    if (!trimmedLine) {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$|^===+$|^\*\*\*+$/.test(trimmedLine)) {
      blocks.push({ type: 'hr', id: i });
      i++;
      continue;
    }

    // H2 Header
    if (trimmedLine.startsWith('## ')) {
      const text = trimmedLine.slice(3).trim();
      const id = slugify(text);
      blocks.push({ type: 'h2', id: `h2-${i}`, text, anchorId: id });
      i++;
      continue;
    }

    // H3 Header
    if (trimmedLine.startsWith('### ')) {
      const text = trimmedLine.slice(4).trim();
      const id = slugify(text);
      blocks.push({ type: 'h3', id: `h3-${i}`, text, anchorId: id });
      i++;
      continue;
    }

    // H1 Header
    if (trimmedLine.startsWith('# ')) {
      const text = trimmedLine.slice(2).trim();
      const id = slugify(text);
      blocks.push({ type: 'h1', id: `h1-${i}`, text, anchorId: id });
      i++;
      continue;
    }

    // Blockquote
    if (trimmedLine.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().slice(1).trim());
        i++;
      }
      blocks.push({ type: 'blockquote', id: `quote-${i}`, content: quoteLines.join(' ') });
      continue;
    }

    // Unordered list
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const items = [];
      while (i < lines.length) {
        const listLine = lines[i].trim();
        if (listLine.startsWith('- ') || listLine.startsWith('* ')) {
          items.push(listLine.slice(2));
          i++;
        } else if (listLine === '') {
          // Check if next line continues the list
          const nextLine = lines[i + 1]?.trim();
          if (nextLine && (nextLine.startsWith('- ') || nextLine.startsWith('* '))) {
            i++;
            continue;
          }
          break;
        } else {
          break;
        }
      }
      blocks.push({ type: 'ul', id: `ul-${i}`, items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmedLine)) {
      const items = [];
      while (i < lines.length) {
        const listLine = lines[i].trim();
        const match = listLine.match(/^(\d+)\.\s(.+)$/);
        if (match) {
          items.push(match[2]);
          i++;
        } else if (listLine === '') {
          const nextLine = lines[i + 1]?.trim();
          if (nextLine && /^\d+\.\s/.test(nextLine)) {
            i++;
            continue;
          }
          break;
        } else {
          break;
        }
      }
      blocks.push({ type: 'ol', id: `ol-${i}`, items });
      continue;
    }

    // Table
    if (trimmedLine.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // Parse header
        const headerCells = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim());

        // Check for separator line
        const isSeparator = /^[|\s\-:]+$/.test(tableLines[1]);
        const dataRows = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

        const rows = dataRows.map((row) =>
          row
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim())
        );

        blocks.push({
          type: 'table',
          id: `table-${i}`,
          headers: headerCells,
          rows,
        });
      }
      continue;
    }

    // Code block
    if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      blocks.push({
        type: 'code',
        id: `code-${i}`,
        language,
        content: codeLines.join('\n'),
      });
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '') {
      const currentLine = lines[i].trim();
      // Stop if we hit a special block
      if (
        currentLine.startsWith('#') ||
        currentLine.startsWith('- ') ||
        currentLine.startsWith('* ') ||
        currentLine.startsWith('>') ||
        currentLine.startsWith('|') ||
        currentLine.startsWith('```') ||
        /^---+$|^===+$|^\*\*\*+$/.test(currentLine) ||
        /^\d+\.\s/.test(currentLine)
      ) {
        break;
      }
      paraLines.push(currentLine);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        id: `p-${i}`,
        content: paraLines.join(' '),
      });
    }

    i++;
  }

  return blocks;
};

// Render a single block
const renderBlock = (block) => {
  switch (block.type) {
    case 'h1':
      return (
        <motion.h1
          id={block.anchorId}
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
        >
          {parseInlineFormatting(block.text)}
        </motion.h1>
      );

    case 'h2':
      return (
        <motion.h2
          id={block.anchorId}
          variants={itemVariants}
          className="text-2xl md:text-3xl font-bold mb-4 mt-8 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent scroll-mt-24"
        >
          {parseInlineFormatting(block.text)}
        </motion.h2>
      );

    case 'h3':
      return (
        <motion.h3
          id={block.anchorId}
          variants={itemVariants}
          className="text-xl md:text-2xl font-semibold mb-3 mt-6 text-sky-300 scroll-mt-24"
        >
          {parseInlineFormatting(block.text)}
        </motion.h3>
      );

    case 'paragraph':
      return (
        <motion.p
          variants={itemVariants}
          className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg"
        >
          {parseInlineFormatting(block.content)}
        </motion.p>
      );

    case 'ul':
      return (
        <motion.ul variants={itemVariants} className="mb-6 space-y-2">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-300">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
              <span className="leading-relaxed">{parseInlineFormatting(item)}</span>
            </li>
          ))}
        </motion.ul>
      );

    case 'ol':
      return (
        <motion.ol variants={itemVariants} className="mb-6 space-y-2 list-decimal list-inside">
          {block.items.map((item, idx) => (
            <li key={idx} className="text-gray-300 pl-2">
              <span className="leading-relaxed">{parseInlineFormatting(item)}</span>
            </li>
          ))}
        </motion.ol>
      );

    case 'blockquote':
      return (
        <motion.blockquote
          variants={itemVariants}
          className="border-l-4 border-sky-500 pl-5 py-2 my-6 bg-slate-800/50 rounded-r-lg"
        >
          <p className="text-gray-300 italic text-lg leading-relaxed">
            {parseInlineFormatting(block.content)}
          </p>
        </motion.blockquote>
      );

    case 'table':
      return (
        <motion.div variants={itemVariants} className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-700">
            <thead>
              <tr className="bg-slate-800">
                {block.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="border border-slate-700 px-4 py-3 text-left text-sky-300 font-semibold"
                  >
                    {parseInlineFormatting(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 0 ? 'bg-slate-900/50' : 'bg-slate-800/30'}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="border border-slate-700 px-4 py-3 text-gray-300"
                    >
                      {parseInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      );

    case 'code':
      return (
        <motion.div variants={itemVariants} className="mb-6">
          {block.language && (
            <div className="bg-slate-800 px-4 py-2 rounded-t-lg border border-slate-700 border-b-0">
              <span className="text-sm text-sky-400 font-mono">{block.language}</span>
            </div>
          )}
          <pre
            className={`bg-slate-900 p-4 overflow-x-auto border border-slate-700 ${
              block.language ? 'rounded-b-lg' : 'rounded-lg'
            }`}
          >
            <code className="text-sm font-mono text-gray-300 leading-relaxed">
              {block.content}
            </code>
          </pre>
        </motion.div>
      );

    case 'hr':
      return (
        <motion.hr
          variants={itemVariants}
          className="my-8 border-t border-slate-700/50"
        />
      );

    default:
      return null;
  }
};

// Main component
const BlogContentRenderer = ({ content }) => {
  const blocks = useMemo(() => parseContent(content), [content]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="blog-content"
    >
      {blocks.map((block) => (
        <motion.div key={block.id}>{renderBlock(block)}</motion.div>
      ))}
    </motion.div>
  );
};

export default BlogContentRenderer;
