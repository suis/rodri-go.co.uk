/**
 * fetch-checkatrade.js
 * Fetches the live score and review count from the Checkatrade profile
 * and writes them to checkatrade-data.json.
 *
 * Run: node scripts/fetch-checkatrade.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const PROFILE_URL = 'https://www.checkatrade.com/trades/rodrigo1096388';
const OUTPUT_FILE = path.join(__dirname, '..', 'checkatrade-data.json');

// Fallback values used if the fetch fails
const FALLBACK = { score: '9.77', reviews: '90' };

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; SiteBot/1.0; +https://rodri-go.co.uk)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
    };

    https.get(url, options, (res) => {
      // Follow redirects (301/302)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function extractData(html) {
  // Score — looks for patterns like: "9.77" or "9.77/10"
  const scoreMatch =
    html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/) ||
    html.match(/(\d+\.\d+)\s*\/\s*10/) ||
    html.match(/class="[^"]*score[^"]*"[^>]*>\s*([\d.]+)/i);

  // Review count — looks for patterns like: "reviewCount": 90  or  "90 reviews"
  const reviewMatch =
    html.match(/"reviewCount"\s*:\s*"?(\d+)"?/) ||
    html.match(/(\d+)\s+reviews?/i) ||
    html.match(/class="[^"]*review[^"]*count[^"]*"[^>]*>\s*(\d+)/i);

  return {
    score: scoreMatch ? scoreMatch[1] : null,
    reviews: reviewMatch ? reviewMatch[1] : null,
  };
}

async function main() {
  console.log(`Fetching Checkatrade profile: ${PROFILE_URL}`);

  let data = { ...FALLBACK };

  try {
    const html = await fetchPage(PROFILE_URL);
    const extracted = extractData(html);

    if (extracted.score) {
      data.score = extracted.score;
      console.log(`  Score found: ${data.score}`);
    } else {
      console.warn('  Score not found — using fallback:', data.score);
    }

    if (extracted.reviews) {
      data.reviews = extracted.reviews;
      console.log(`  Reviews found: ${data.reviews}`);
    } else {
      console.warn('  Review count not found — using fallback:', data.reviews);
    }
  } catch (err) {
    console.warn(`  Fetch failed (${err.message}) — using fallback values`);
  }

  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Written to ${OUTPUT_FILE}:`, data);
}

main();
