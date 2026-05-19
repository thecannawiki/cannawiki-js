import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const wikiDir = resolve(__dirname, '../src/wiki');
const outputFile = resolve(__dirname, '../public/search-index.json');

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'you', 'your', 'this', 'they', 'their', 'can', 'not', 'but',
  'if', 'when', 'which', 'who', 'what', 'how', 'all', 'also', 'than', 'then',
  'them', 'these', 'those', 'into', 'may', 'more', 'most', 'other', 'some',
  'such', 'only', 'over', 'been', 'being', 'have', 'had', 'do', 'does', 'did',
]);

function stripForIndex(raw) {
  return raw
    .replace(/<ref>[\s\S]*?<\/ref>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/[*_~`>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function tokenize(text) {
  return text
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function buildTermCounts(tokens) {
  const terms = {};
  for (const token of tokens) {
    terms[token] = (terms[token] || 0) + 1;
  }
  return terms;
}

function slugToTitle(slug) {
  if (slug === 'Home') return 'Cannawiki';
  return slug.replaceAll('_', ' ');
}

function buildIndex() {
  const files = readdirSync(wikiDir).filter((f) => f.endsWith('.md'));
  const pages = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const raw = readFileSync(join(wikiDir, filename), 'utf8');
    const text = stripForIndex(raw);
    const tokens = tokenize(text);
    return {
      slug,
      title: slugToTitle(slug),
      terms: buildTermCounts(tokens),
      text,
    };
  });

  pages.sort((a, b) => a.title.localeCompare(b.title));

  return { version: 1, pages };
}

const index = buildIndex();
writeFileSync(outputFile, JSON.stringify(index));
console.log(`Search index written to ${outputFile} (${index.pages.length} pages)`);
