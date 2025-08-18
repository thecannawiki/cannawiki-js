import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, resolve, relative, extname } from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const sourceDir = resolve(__dirname, '../src');      // Folder to scan
const outputDir = resolve(__dirname, '../public');   // Output to public
const outputFile = join(outputDir, 'file-timestamps.json');

function walkDir(dir, callback) {
  readdirSync(dir).forEach(file => {
    const fullPath = join(dir, file);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (extname(fullPath) === '.md') {
      callback(fullPath, stats);
    }
  });
}

function collectTimestamps(baseDir) {
  const result = {};
  walkDir(baseDir, (filePath, stats) => {
    if(filePath.includes(".md")){
      const relPath = relative(baseDir, filePath);
      result[relPath] = stats.mtime.toISOString();
    }
  });
  return result;
}

function writeTimestamps() {
  const timestamps = collectTimestamps(sourceDir);
  writeFileSync(outputFile, JSON.stringify(timestamps, null, 2));
  console.log('✅ Markdown file timestamps written to:', outputFile);
}

writeTimestamps();
