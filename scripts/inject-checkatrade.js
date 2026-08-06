/**
 * inject-checkatrade.js
 * Reads checkatrade-data.json and replaces the score + review count
 * in all HTML files.
 *
 * Run: node scripts/inject-checkatrade.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'checkatrade-data.json');

const HTML_FILES = [
  'index.html',
  'about.html',
  'contact.html',
  'services.html',
  'projects.html',
  'interior-painting.html',
  'exterior-painting.html',
];

if (!fs.existsSync(DATA_FILE)) {
  console.error('checkatrade-data.json not found — run fetch-checkatrade.js first');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const { score, reviews } = data;

console.log(`Injecting: score=${score}, reviews=${reviews}`);

// Matches the score inside the ct-widget, e.g.:  9.79<span class="ct-widget__outof">
const SCORE_REGEX = /(<span class="ct-widget__score">)([\d.]+)(<span class="ct-widget__outof">)/g;

// Matches the review count, e.g.:  <span class="ct-widget__reviews">90 reviews</span>
const REVIEWS_REGEX = /(<span class="ct-widget__reviews">)(\d+)( reviews<\/span>)/g;

let updatedFiles = 0;

for (const filename of HTML_FILES) {
  const filepath = path.join(ROOT, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`  Skipping missing file: ${filename}`);
    continue;
  }

  let html = fs.readFileSync(filepath, 'utf8');
  const original = html;

  html = html.replace(SCORE_REGEX, `$1${score}$3`);
  html = html.replace(REVIEWS_REGEX, `$1${reviews}$3`);

  if (html !== original) {
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`  Updated: ${filename}`);
    updatedFiles++;
  } else {
    console.log(`  No changes: ${filename}`);
  }
}

console.log(`Done. ${updatedFiles} file(s) updated.`);
