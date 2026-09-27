#!/usr/bin/env node
/* Ahimsa parity gate.
   Ahimsa Day is a restructure of an existing, shipping system, not a
   redesign. Every canonical token must still resolve to the same thing:

     - colour, gradients, spacing, radius, shadow, motion -> byte-identical
     - the type scale -> computed-pixel-identical (px moved to rem so that
       a person's own browser font-size is no longer overridden)

   Additive tokens are fine and expected. A CHANGED value is not.
   This gate is worth more than the extraction itself: it is what stops a
   future edit from silently moving a value two shipping apps depend on. */

import { readTokens, toPx, norm } from './lib/css-tokens.mjs';
import { readFileSync } from 'node:fs';

const CANON = JSON.parse(readFileSync(new URL('./canonical-tokens.json', import.meta.url), 'utf8')).tokens;

/* Named, deliberate deviations from the original token set.
   Each needs a reason good enough to survive review, and each is listed on
   the accessibility page. Anything NOT in this list must match exactly —
   that is the whole point of the gate. */
const DEVIATIONS = {
  '--text-secondary': 'WCAG 1.4.3: the original 65% alpha measures 3.64:1 on the darkest Day ground and fails AA for the descriptions and captions it exists to set. Raised to 76% (4.79:1) — the value a shipping consumer had already independently arrived at.',
  '--text-muted':     'WCAG 1.4.3: the original 45% alpha measures 2.30:1 and fails even the 3:1 large-text floor, for small-caps labels and metadata. Raised to 60% (3.23:1).',
  '--text-faint':     'The original 28% alpha measures 1.63:1. Raised to 40% (2.07:1) and redefined as hints only — it is now used by no component and must never be the sole carrier of meaning.',
};

/* Compared by computed px rather than by bytes. */
const REM_CONVERTED = new Set([
  '--size-micro', '--size-xs', '--size-sm', '--size-base', '--size-md',
  '--size-lg', '--size-xl', '--size-2xl', '--size-3xl', '--size-4xl', '--size-5xl',
]);

const day = readTokens([
  'src/tokens/shared.css',
  'src/tokens/day/palette.css',
  'src/tokens/day/gradients.css',
  'src/tokens/day/semantic.css',
  'src/tokens/day/elevation.css',
  'src/tokens/day/type.css',
]);

const missing = [];
const changed = [];
const deviated = [];

for (const [name, want] of Object.entries(CANON)) {
  if (!day.has(name)) { missing.push(name); continue; }
  const got = day.get(name);

  if (REM_CONVERTED.has(name)) {
    const a = toPx(want), b = toPx(got);
    if (a === null || b === null || Math.abs(a - b) > 0.001) {
      changed.push(`${name}\n      canonical ${want} (${a}px)\n      ours      ${got} (${b}px)`);
    }
    continue;
  }

  if (norm(want) !== norm(got)) {
    if (name in DEVIATIONS) { deviated.push(name); continue; }
    changed.push(`${name}\n      canonical ${want}\n      ours      ${got}`);
  }
}

const added = [...day.keys()].filter((k) => !(k in CANON)).sort();

console.log(`canonical tokens: ${Object.keys(CANON).length}`);
console.log(`day tokens:       ${day.size}`);
console.log(`additive:         ${added.length}`);
console.log(`deviations:       ${deviated.length} of ${Object.keys(DEVIATIONS).length} declared`);

/* A declared deviation that no longer deviates is stale bookkeeping. */
const stale = Object.keys(DEVIATIONS).filter((k) => !deviated.includes(k));
if (stale.length) {
  console.error(`\nFAIL — deviation(s) declared but not present: ${stale.join(', ')}`);
  console.error('Either restore the canonical value or remove the entry from DEVIATIONS.');
  process.exit(1);
}

if (deviated.length) {
  console.log('\ndeclared deviations:');
  for (const d of deviated) console.log(`   ${d}\n      ${DEVIATIONS[d]}`);
}

if (missing.length) {
  console.error(`\nFAIL — ${missing.length} canonical token(s) missing:`);
  for (const m of missing) console.error(`   ${m}`);
}
if (changed.length) {
  console.error(`\nFAIL — ${changed.length} canonical value(s) changed:`);
  for (const c of changed) console.error(`   ${c}`);
}

if (missing.length || changed.length) {
  console.error('\nDay must render byte-for-byte what Giraffy and Treasured already render.');
  process.exit(1);
}

console.log(`\nOK — ${Object.keys(CANON).length - deviated.length} of ${Object.keys(CANON).length} canonical values preserved byte-for-byte,`);
console.log('     type scale converted to rem at identical computed sizes,');
console.log(`     ${deviated.length} accessibility deviation(s) declared above.`);
if (process.argv.includes('--verbose')) {
  console.log('\nadditive tokens:');
  for (const a of added) console.log(`   ${a} = ${day.get(a)}`);
}
