import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import GithubSlugger from 'github-slugger';

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

function normalizeChunk(chunk) {
  return chunk
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

function headingPlainText(raw) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/^#+\s*|#+\s*$/g, '')
    .trim();
}

function appendText(text, chunk) {
  const cleaned = normalizeChunk(chunk);
  if (!cleaned) return text;
  if (text.length > 0) return `${text} ${cleaned}`;
  return cleaned;
}

function parseWikiContent(raw) {
  const slugger = new GithubSlugger();
  const headings = [];
  let text = '';

  for (const line of raw.split('\n')) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const plain = headingPlainText(headingMatch[2]);
      if (plain) {
        headings.push({ id: slugger.slug(plain), offset: text.length });
        text = appendText(text, plain);
      }
      continue;
    }

    const lineWithoutRefs = line.replace(/<ref>[\s\S]*?<\/ref>/gi, ' ');
    text = appendText(text, lineWithoutRefs);
  }

  const tokens = tokenize(text);
  return { text, headings, terms: buildTermCounts(tokens) };
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
    const { text, headings, terms } = parseWikiContent(raw);
    return {
      slug,
      title: slugToTitle(slug),
      terms,
      text,
      headings,
    };
  });

  pages.sort((a, b) => a.title.localeCompare(b.title));

  return { version: 2, pages };
}

const index = buildIndex();
writeFileSync(outputFile, JSON.stringify(index));
console.log(`Search index written to ${outputFile} (${index.pages.length} pages)`);
