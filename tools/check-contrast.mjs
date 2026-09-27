#!/usr/bin/env node
/* Ahimsa contrast gate.
   Ported from the one real WCAG check that existed in a consuming app, and
   widened: both themes, every gradient, and the non-text 3:1 rule (1.4.11)
   the original did not cover.

   Quiet text in this system is the ink colour at low alpha, so every
   comparison composites the ink onto its actual ground first. */

import { readTokens } from './lib/css-tokens.mjs';
import { readFileSync } from 'node:fs';
import { parseHex, over, contrast, gradientStops, resolve } from './lib/color.mjs';

const AA_SMALL = 4.5;  /* body and headings */
const AA_LARGE = 3.0;  /* >= 24px, or >= 19px bold */
const NON_TEXT = 3.0;  /* borders, focus rings, meaningful glyphs (1.4.11) */

const THEMES = {
  day: [
    'src/tokens/shared.css', 'src/tokens/day/palette.css', 'src/tokens/day/gradients.css',
    'src/tokens/day/semantic.css', 'src/tokens/day/elevation.css',
  ],
  night: [
    'src/tokens/shared.css', 'src/tokens/night/palette.css', 'src/tokens/night/gradients.css',
    'src/tokens/night/semantic.css', 'src/tokens/night/elevation.css',
  ],
};

/* Ink roles, with the threshold each one owes and why. */
const INK = [
  ['--text-heading',   AA_SMALL, 'titles and display type'],
  ['--text-body',      AA_SMALL, 'body copy'],
  ['--text-secondary', AA_SMALL, 'descriptions and captions — real content'],
  ['--text-muted',     AA_LARGE, 'small-caps labels and metadata'],
];
/* --text-faint is reported, never gated: it is for hints and placeholders
   and must never be the only carrier of anything. See docs/accessibility. */

/* --border-strong is deliberately NOT here: it is a separator, and a
   separator carries no information (WCAG 1.4.11 applies to boundaries that
   identify a component or a state). --border-control is the one that draws
   a control's edge, so it is the one that owes 3:1. */
const NON_TEXT_TOKENS = ['--border-control', '--focus-ring'];

const rows = [];
const fails = [];
const warns = [];

for (const [theme, files] of Object.entries(THEMES)) {
  const t = readTokens(files);
  const get = (n) => parseHex(resolve(t, t.get(n)));

  const grounds = [
    ['--surface-canvas-flat', get('--surface-canvas-flat')],
    ['--surface-elevated',    get('--surface-elevated')],
    ['--surface-sunk',        get('--surface-sunk')],
  ];

  /* --- ink on flat surfaces --- */
  for (const [groundName, ground] of grounds) {
    for (const [inkName, floor, why] of INK) {
      const ink = get(inkName);
      const ratio = contrast(over(ink, ground), ground);
      rows.push([theme, inkName, groundName, ratio, floor]);
      if (ratio < floor) fails.push(`${theme}  ${inkName} on ${groundName}  ${ratio.toFixed(2)}:1  needs ${floor}  (${why})`);
    }
    const faint = get('--text-faint');
    rows.push([theme, '--text-faint', groundName, contrast(over(faint, ground), ground), 0]);
  }

  /* --- Gradients, tested as the real composition.
     Bare default ink on a bare gradient is not a thing this system does,
     and gating it would only produce noise. What ships is
     .ah-surface--<name>, which carries its own measured ink; that is what
     gets checked. A gradient emitted as surface-only declares no ink and
     is skipped here — its rule is enforced in docs and by review, because
     "do not put text here" is not a contrast ratio. --- */
  const surf = readTokens([`src/tokens/${theme}/surfaces.css`]);
  const surfCss = readFileSync(`src/tokens/${theme}/surfaces.css`, 'utf8');
  for (const [name, value] of t) {
    if (!name.startsWith('--gradient-')) continue;
    const slug = name.replace('--gradient-', '');
    const block = new RegExp(`\\.ah-surface--${slug}\\s*\\{([^}]*)\\}`).exec(surfCss);
    if (!block || !/--text-heading/.test(block[1])) continue; /* surface-only */
    const local = readTokens.call(null, []); /* fresh map */
    const inks = {};
    for (const m of block[1].matchAll(/(--[a-z-]+):\s*([^;]+);/g)) inks[m[1]] = m[2].trim();
    const stops = gradientStops(resolve(t, value)).map(parseHex);
    for (const ground of stops) {
      for (const [inkName, floor] of INK) {
        if (!inks[inkName]) continue;
        const ink = parseHex(inks[inkName]);
        const ratio = contrast(over(ink, ground), ground);
        if (ratio < floor) {
          const msg = `${theme}  ${inkName} on .ah-surface--${slug} @ ${ground.r},${ground.g},${ground.b}  ${ratio.toFixed(2)}:1  needs ${floor}`;
          (inkName === '--text-muted' ? warns : fails).push(msg);
        }
      }
    }
  }

  /* --- non-text (1.4.11) --- */
  for (const tok of NON_TEXT_TOKENS) {
    const c = get(tok);
    if (!c) continue;
    for (const [groundName, ground] of grounds) {
      const ratio = contrast(over(c, ground), ground);
      rows.push([theme, tok, groundName, ratio, NON_TEXT]);
      if (ratio < NON_TEXT) fails.push(`${theme}  ${tok} on ${groundName}  ${ratio.toFixed(2)}:1  needs ${NON_TEXT}  (non-text contrast, WCAG 1.4.11)`);
    }
  }

  /* --- Ahimsa's own colour law --- */
  const sum = (c) => c.r + c.g + c.b;
  const darkest = theme === 'day' ? get('--neutral-900') : get('--neutral-950');
  const lightest = get('--neutral-50');
  if (sum(darkest) <= 12) fails.push(`${theme}  darkest ground is effectively pure black — Ahimsa refuses it`);
  if (sum(lightest) >= 750) fails.push(`${theme}  lightest ink is effectively pure white — Ahimsa refuses it`);
}

const pad = (s, n) => String(s).padEnd(n);
if (process.argv.includes('--report')) {
  console.log(`${pad('theme', 7)}${pad('token', 20)}${pad('ground', 24)}ratio   floor`);
  for (const [th, tok, gr, r, f] of rows) {
    const flag = f && r < f ? '  <-- FAIL' : '';
    console.log(`${pad(th, 7)}${pad(tok, 20)}${pad(gr, 24)}${r.toFixed(2).padStart(5)}   ${f || '-'}${flag}`);
  }
  console.log('');
}

if (warns.length) {
  console.log(`${warns.length} advisory (muted ink below 3:1 on a gradient stop — never its only channel):`);
  for (const w of warns.slice(0, 8)) console.log(`   ${w}`);
  if (warns.length > 8) console.log(`   ... and ${warns.length - 8} more`);
  console.log('');
}

if (fails.length) {
  console.error(`FAIL — ${fails.length} contrast violation(s):`);
  for (const f of fails) console.error(`   ${f}`);
  process.exit(1);
}
console.log('OK — contrast gates pass for Day and Night.');
