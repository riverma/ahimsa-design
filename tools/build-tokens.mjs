#!/usr/bin/env node
/* Emit tokens.json — every token, both aesthetics, in W3C DTCG format.
   The original system's readme cited a tokens.json as its authoritative
   source. That file no longer exists anywhere, so this is the reverse:
   the CSS is canonical and this is generated from it. Consumers that want
   machine-readable tokens (an agent, a Figma bridge, a native port) read
   this; nothing reads it back. */

import { readTokens, toPx } from './lib/css-tokens.mjs';
import { writeFileSync } from 'node:fs';

const VERSION = JSON.parse(await import('node:fs').then((m) => m.readFileSync('package.json', 'utf8'))).version;

const GROUPS = [
  [/^--neutral-/, 'color', 'palette.neutral'],
  [/^--(saffron|turmeric|clay|bodhi|peacock|indigo|monsoon|amber|rose|terracotta|sage|violet|slate|periwinkle|frost|ember)-/, 'color', 'palette.accent'],
  [/^--gradient-/, 'gradient', 'gradient'],
  [/^--surface-/, 'color', 'semantic.surface'],
  [/^--text-/, 'color', 'semantic.text'],
  [/^--border-/, 'color', 'semantic.border'],
  [/^--accent-/, 'color', 'semantic.accent'],
  [/^--glass-|^--focus-ring/, 'color', 'semantic.effect'],
  [/^--shadow-|^--glow-/, 'shadow', 'elevation'],
  [/^--space-/, 'dimension', 'space'],
  [/^--radius-/, 'dimension', 'radius'],
  [/^--size-/, 'dimension', 'typography.size'],
  [/^--weight-/, 'fontWeight', 'typography.weight'],
  [/^--leading-/, 'number', 'typography.lineHeight'],
  [/^--tracking-/, 'dimension', 'typography.letterSpacing'],
  [/^--font-/, 'fontFamily', 'typography.family'],
  [/^--duration-/, 'duration', 'motion.duration'],
  [/^--ease-/, 'cubicBezier', 'motion.easing'],
  [/^--ambient-/, 'other', 'ambient'],
];

function classify(name) {
  for (const [re, type, group] of GROUPS) if (re.test(name)) return { type, group };
  return { type: 'other', group: 'other' };
}

function set(root, path, leaf, node) {
  let cur = root;
  for (const part of path.split('.')) cur = (cur[part] ??= {});
  cur[leaf] = node;
}

function build(theme) {
  const t = readTokens([
    'src/tokens/shared.css',
    `src/tokens/${theme}/palette.css`,
    `src/tokens/${theme}/gradients.css`,
    `src/tokens/${theme}/semantic.css`,
    `src/tokens/${theme}/elevation.css`,
    `src/tokens/${theme}/type.css`,
  ]);
  const out = {};
  for (const [name, raw] of [...t.entries()].sort()) {
    const { type, group } = classify(name);
    const leaf = name.replace(/^--/, '');
    const node = { $type: type, $value: raw };
    /* An alias stays an alias — the whole point of a semantic layer is
       that you can see what it points at. */
    const alias = /^var\(\s*(--[A-Za-z0-9-]+)\s*\)$/.exec(raw);
    if (alias) node.$value = `{${alias[1].replace(/^--/, '')}}`;
    const px = toPx(raw);
    if (px !== null) node.$extensions = { 'design.ahimsa.px': px };
    set(out, group, leaf, node);
  }
  return out;
}

const doc = {
  $description: `Ahimsa Design System v${VERSION}. Generated from the CSS by tools/build-tokens.mjs — the CSS is canonical, this is the machine-readable view of it. Values marked {like.this} are aliases into the same document. MIT.`,
  $extensions: {
    'design.ahimsa.version': VERSION,
    'design.ahimsa.note': 'Day and Night define an identical set of semantic names. A component references semantics only, never a palette step — that is what makes markup portable between the two aesthetics.',
  },
  day: build('day'),
  night: build('night'),
};

writeFileSync('tokens.json', JSON.stringify(doc, null, 2) + '\n');
const count = (o) => Object.values(o).reduce((n, v) => n + (v && v.$type ? 1 : count(v)), 0);
console.log(`tokens.json  day ${count(doc.day)} · night ${count(doc.night)} tokens`);
