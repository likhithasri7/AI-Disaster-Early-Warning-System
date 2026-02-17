const fs = require('fs');
const path = require('path');

function removeComments(content) {
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  const lines = content.split('\n');
  const result = lines.map(line => {
    const singleLineComment = line.indexOf('//');
    if (singleLineComment !== -1) {
      const beforeComment = line.substring(0, singleLineComment);
      const hasString = (beforeComment.match(/"/g) || []).length % 2 !== 0 ||
                        (beforeComment.match(/'/g) || []).length % 2 !== 0 ||
                        (beforeComment.match(/`/g) || []).length % 2 !== 0;
      
      if (!hasString) {
        return beforeComment.trimEnd();
      }
    }
    return line;
  });
  
  return result.join('\n').replace(/\n{3,}/g, '\n\n');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const cleaned = removeComments(content);
  fs.writeFileSync(filePath, cleaned, 'utf8');
  console.log(`Processed: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (/\.(js|jsx)$/.test(file)) {
      processFile(filePath);
    }
  });
}

walkDir('./src');
console.log('All comments removed!');
