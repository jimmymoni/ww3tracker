import fs from 'fs';

let content = fs.readFileSync('src/data/blogPosts.js', 'utf8');

// Fix the syntax errors from PowerShell insertion
content = content.replace(/},'r/g, '},');

// Fix em-dash encoding issues
content = content.replace(/�\?\"/g, '—');
content = content.replace(/â€\"/g, '—');
content = content.replace(/â€\?/g, '—');

// Fix other common encoding issues
content = content.replace(/�/g, '—');

fs.writeFileSync('src/data/blogPosts.js', content, 'utf8');
console.log('Fixed encoding issues');
