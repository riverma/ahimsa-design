#!/usr/bin/env node
/* Capture the review set: every page, both aesthetics, phone and desktop.
   Filenames are stable across rounds so successive rounds diff cleanly.

   Playwright is optional and developer-only; this repo ships no runtime
   dependencies and a screenshot tool is no reason to change that. */

import { mkdirSync } from 'node:fs';
import { createRequire as _cr } from 'node:module';

/* Playwright is an optional, developer-only dependency — nothing this
   system ships depends on it. Resolve it from this package first, then
   from a checkout named by AHIMSA_PLAYWRIGHT_FROM. */
function loadPlaywright() {
  const candidates = [import.meta.url];
  if (process.env.AHIMSA_PLAYWRIGHT_FROM) candidates.push(process.env.AHIMSA_PLAYWRIGHT_FROM);
  for (const from of candidates) {
    try { return _cr(from)('@playwright/test'); } catch { /* try the next */ }
  }
  console.error(
    'Playwright not found.\n' +
    '  npm i -D @playwright/test && npx playwright install webkit\n' +
    'or point at an existing checkout that already has it:\n' +
    '  AHIMSA_PLAYWRIGHT_FROM=/path/to/package.json npm run shots'
  );
  process.exit(2);
}

const { webkit, chromium } = loadPlaywright();
/* WebKit, not Chromium: the cached Chromium build does not match this
   Playwright, and WebKit is the engine this system's consumers actually run
   on iOS anyway — backdrop-filter and mix-blend-mode are exactly where it
   differs from Blink. */
const engine = process.env.AHIMSA_ENGINE === 'chromium' ? chromium : webkit;


const BASE = process.env.AHIMSA_URL || 'http://127.0.0.1:8173';
const OUT = process.argv[2] || 'shots';
const PAGES = process.env.AHIMSA_PAGES
  ? process.env.AHIMSA_PAGES.split(',')
  : ['index', 'foundations', 'components', 'patterns', 'principles', 'accessibility', 'agents'];

const VIEWPORTS = [
  ['phone', { width: 390, height: 844 }, 2],
  ['desktop', { width: 1280, height: 900 }, 2],
];

mkdirSync(OUT, { recursive: true });

const browser = await engine.launch();
let n = 0;

for (const [vpName, viewport, scale] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale });
  const pg = await ctx.newPage();
  for (const theme of ['day', 'night']) {
    for (const name of PAGES) {
      const url = `${BASE}/${name}.html`;
      const res = await pg.goto(url, { waitUntil: 'load' }).catch(() => null);
      if (!res || (!res.ok() && res.status() !== 304)) { console.log(`skip ${name} (${res ? res.status() : 'no response'})`); continue; }
      /* Set the theme the way a visitor would, then let fonts settle. */
      /* The theme has to be in place BEFORE the page loads. Swapping the
         class afterwards leaves WebKit resolving custom properties from
         the theme that was active at parse time, which silently produces
         measurements for a page nobody is looking at. */
      if (await pg.evaluate(() => document.documentElement.className) !== 'ahimsa-' + theme) {
        await pg.evaluate((t) => localStorage.setItem('ahimsa-theme', t), theme);
        await pg.reload({ waitUntil: 'load' });
      }
      await pg.evaluate(() => document.fonts.ready);
      /* Let entrance animations finish. A toast measured half-way through
         its fade reports a contrast ratio for a frame nobody reads, and a
         screenshot catches it mid-air. */
      await pg.evaluate(() => { for (const a of document.getAnimations()) { try { a.finish(); } catch {} } });
      await pg.waitForTimeout(250);
      const file = `${OUT}/${theme}-${name}-${vpName}.png`;
      try {
        await pg.screenshot({ path: file, fullPage: true });
      } catch {
        /* WebKit refuses a fullPage shot past a certain height. A long
           specimen page gets sliced instead of silently skipped — a review
           round that quietly drops a page is worse than one with more files. */
        const h = await pg.evaluate(() => document.documentElement.scrollHeight);
        const slice = 7000;
        const parts = Math.ceil(h / slice);
        for (let i = 0; i < parts; i++) {
          await pg.evaluate((y) => window.scrollTo(0, y), i * slice);
          await pg.waitForTimeout(120);
          const part = `${OUT}/${theme}-${name}-${vpName}-${String(i + 1).padStart(2, '0')}.png`;
          await pg.screenshot({ path: part, clip: { x: 0, y: 0, width: viewport.width, height: Math.min(slice, h - i * slice) } });
          console.log(part);
          n++;
        }
        await pg.evaluate(() => window.scrollTo(0, 0));
        continue;
      }
      console.log(file);
      n++;
    }
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${n} screenshots -> ${OUT}/`);
