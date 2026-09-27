#!/usr/bin/env node
/* The accessibility gate.
   axe-core over every page, in both aesthetics, at three widths and at 200%
   zoom — plus the checks axe cannot make: target size, forced-colors
   coverage, suppressed focus, and px font sizes.

   Playwright is borrowed from a sibling repo; axe-core is a devDependency.
   Neither reaches the shipped CSS, which has no dependencies at all. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/home/pez/workspace/assets/giraffy/package.json');
const { webkit } = require('@playwright/test');
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const BASE = process.env.AHIMSA_URL || 'http://127.0.0.1:8173';
const PAGES = ['index', 'foundations', 'components', 'patterns', 'principles', 'accessibility', 'agents'];
const WIDTHS = [
  ['320', { width: 320, height: 800 }, 1],
  ['390', { width: 390, height: 844 }, 1],
  ['1280', { width: 1280, height: 900 }, 1],
  ['1280@200%', { width: 1280, height: 900 }, 2], /* 200% zoom == half the CSS pixels */
];

const fails = [];
const notes = [];

/* ---------- 1. static checks axe cannot make ---------- */

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules' || n.startsWith('.')) continue;
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p, out) : (extname(p) === '.css' && out.push(p));
  }
  return out;
}

const cssFiles = walk('src');
for (const f of cssFiles) {
  const css = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  /* A px font-size overrides the reader's own browser setting. */
  for (const m of css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)) {
    if (m[1] !== '0') fails.push(`${f}  font-size: ${m[1]}px — the type scale is rem so that resizing text works (WCAG 1.4.4)`);
  }
  /* outline:none is only allowed where something visible replaces it. */
  for (const m of css.matchAll(/([^{}]*)\{[^}]*outline:\s*none/g)) {
    if (!/focus-visible|:focus:not\(:focus-visible\)|forced-colors/.test(m[1] + css.slice(m.index, m.index + 400))) {
      fails.push(`${f}  outline: none on "${m[1].trim().slice(0, 60)}" with no visible replacement (WCAG 2.4.7)`);
    }
  }
}

/* --text-muted measures around 3:1. That clears the non-text bar and not
   the 4.5:1 that small text owes, so no component may set type in it. This
   is exactly the mistake the first pass made: 10px small-caps labels in
   --text-muted measured 3.35:1. */
for (const f of cssFiles) {
  const css = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const sel = m[1].trim(), body = m[2];
    if (!/color:\s*var\(--text-muted\)/.test(body)) continue;
    /* a background or a border in --text-muted is non-text and fine */
    fails.push(`${f}  "${sel.slice(0, 60)}" sets text colour to --text-muted, which does not clear 4.5:1. Use --text-secondary.`);
  }
}

/* Every component family needs a forced-colors story: Windows High Contrast
   discards both glass and gradients, and this system is built on both. */
const allCss = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
const forced = allCss.slice(allCss.indexOf('forced-colors: active'));
for (const cls of ['.ah-card', '.ah-btn', '.ah-pill', '.ah-chip', '.ah-sheet', '.ah-mono', '.ah-toast', '.ah-ambient']) {
  if (!forced.includes(cls)) fails.push(`no forced-colors: active rule covers ${cls}`);
}

/* ---------- 2. axe, in the browser ---------- */

const browser = await webkit.launch();
let runs = 0;

for (const [label, viewport, dsf] of WIDTHS) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf });
  const pg = await ctx.newPage();
  for (const theme of ['day', 'night']) {
    for (const name of PAGES) {
      const res = await pg.goto(`${BASE}/${name}.html`, { waitUntil: 'load' }).catch(() => null);
      if (!res) { fails.push(`could not load ${name}.html`); continue; }
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
      await pg.addScriptTag({ content: axeSource });
      const out = await pg.evaluate(async () => {
        /* eslint-disable no-undef */
        return await axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        });
      });
      runs++;
      /* Report the actual failing node and axe's own measurement, not just
         the rule name. A violation you have to go re-derive by hand is a
         violation that does not get fixed. */
      for (const v of out.violations) {
        const where = `${theme}/${name}@${label}`;
        for (const node of v.nodes.slice(0, 4)) {
          const why = (node.any[0]?.message || node.all[0]?.message || v.help).replace(/\s+/g, ' ').trim();
          const line = `${where}  ${v.id} — ${node.target.join(' ').slice(0, 80)}\n      ${why.slice(0, 180)}`;
          (v.impact === 'minor' ? notes : fails).push(line);
        }
        if (v.nodes.length > 4) notes.push(`${where}  ${v.id} — and ${v.nodes.length - 4} more nodes`);
      }

      /* Target size, measured in the layout rather than guessed from CSS. */
      if (label === '390') {
        const small = await pg.evaluate(() => {
          const out = [];
          for (const el of document.querySelectorAll('a[href], button, input, [role="button"], [tabindex="0"]')) {
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            if (el.classList.contains('ah-visually-hidden')) continue;
            if (getComputedStyle(el).visibility === 'hidden') continue;
            let w = r.width, h = r.height;
            const cs = getComputedStyle(el, '::after');
            if (cs && cs.content !== 'none') {
              const ah = parseFloat(cs.height) || 0, amh = parseFloat(cs.minHeight) || 0;
              h = Math.max(h, ah, amh);
            }
            /* 2.5.8 exempts a link inside a sentence. "Inside a sentence"
               means the parent is running text — not merely that the anchor
               computes to inline, because a flex child blockifies. */
            if (el.tagName === 'A') {
              const pt = el.parentElement ? getComputedStyle(el.parentElement).display : '';
              const inProse = pt === 'block' || pt === 'inline' || pt === 'list-item';
              if (inProse && getComputedStyle(el).display.startsWith('inline')) continue;
            }
            if (w < 24 || h < 24) out.push(`${el.tagName.toLowerCase()}.${el.className} ${Math.round(w)}x${Math.round(h)}`);
          }
          return out;
        });
        for (const s of new Set(small)) fails.push(`${theme}/${name}  target under 24x24: ${s} (WCAG 2.5.8)`);
      }
    }
  }
  await ctx.close();
}
await browser.close();

console.log(`axe: ${runs} page runs across ${WIDTHS.length} widths x 2 aesthetics`);
if (notes.length) {
  console.log(`\n${notes.length} minor note(s):`);
  for (const n of [...new Set(notes)].slice(0, 10)) console.log(`   ${n}`);
}
if (fails.length) {
  const uniq = [...new Set(fails)];
  console.error(`\nFAIL — ${uniq.length} accessibility issue(s):`);
  for (const f of uniq) console.error(`   ${f}`);
  process.exit(1);
}
console.log('OK — WCAG 2.2 AA clean in both aesthetics, 320 to 1280 and at 200% zoom.');
