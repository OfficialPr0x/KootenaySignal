#!/usr/bin/env node
/**
 * Download all photos from a Facebook Page using the Graph API.
 *
 * Prerequisites:
 *   1. Create a Facebook App at https://developers.facebook.com
 *   2. Add the "Pages Read Engagement" permission
 *   3. Generate a long-lived Page Access Token for your page
 *   4. npm install node-fetch  (or run with Node 18+ which has fetch built-in)
 *
 * Usage:
 *   PAGE_ACCESS_TOKEN=<your_token> PAGE_ID=me node download-fb-photos.js
 *
 * Output:
 *   Creates a ./fb-photos/ directory and saves every photo as a .jpg file.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL } from 'url';

const TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID || 'me';
const OUTPUT_DIR = path.resolve('./fb-photos');

if (!TOKEN) {
  console.error('Error: PAGE_ACCESS_TOKEN environment variable is required.');
  console.error('  Example: PAGE_ACCESS_TOKEN=xxxxx node download-fb-photos.js');
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function apiFetch(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph API error ${res.status}: ${body}`);
  }
  return res.json();
}

function downloadFile(imageUrl, destPath) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(imageUrl);
    const protocol = parsed.protocol === 'https:' ? https : (await import('http')).default;
    const file = fs.createWriteStream(destPath);
    https.get(imageUrl, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function fetchAllPhotos() {
  let url = `https://graph.facebook.com/v19.0/${PAGE_ID}/photos?fields=id,name,images,created_time&limit=100&access_token=${TOKEN}`;
  const photos = [];

  while (url) {
    console.log(`Fetching page of photos...`);
    const data = await apiFetch(url);
    if (data.data) photos.push(...data.data);
    url = data.paging?.next || null;
  }

  return photos;
}

async function main() {
  console.log(`Fetching photos for page: ${PAGE_ID}`);
  const photos = await fetchAllPhotos();
  console.log(`Found ${photos.length} photos. Downloading...`);

  let downloaded = 0;
  let failed = 0;

  for (const photo of photos) {
    // Pick the highest-resolution image available
    const best = photo.images?.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
    if (!best?.source) { failed++; continue; }

    const date = photo.created_time?.slice(0, 10) ?? 'unknown';
    const filename = `${date}_${photo.id}.jpg`;
    const destPath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(destPath)) {
      console.log(`  Skipping (already exists): ${filename}`);
      downloaded++;
      continue;
    }

    try {
      await downloadFile(best.source, destPath);
      console.log(`  Downloaded: ${filename} (${best.width}x${best.height})`);
      downloaded++;
    } catch (err) {
      console.error(`  Failed: ${photo.id} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${downloaded} downloaded, ${failed} failed.`);
  console.log(`Photos saved to: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
