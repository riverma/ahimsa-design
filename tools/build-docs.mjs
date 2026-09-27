#!/usr/bin/env node
/* Generate the documentation site.
   The specimen pages read their values out of the real token CSS, so a
   colour chart or a type scale here cannot drift from what ships. */

import { writeFileSync } from 'node:fs';
import { page, section, p, snippet, spec, esc, tokens, val, inkOn, VERSION,
         gradientStops, parseHex, luminance } from './docs-lib.mjs';

const DAY = tokens('day');
const NIGHT = tokens('night');

const TRADITION = ['saffron', 'turmeric', 'clay', 'bodhi', 'peacock', 'indigo', 'monsoon'];
const CLASSIC = ['amber', 'rose', 'terracotta', 'sage', 'violet', 'slate', 'periwinkle'];
const NIGHT_FAMILIES = ['peacock', 'indigo', 'monsoon', 'bodhi', 'frost', 'ember'];

/* ---------- reusable renderers ---------- */

function ramp(t, family, steps) {
  const cells = steps.map((s) => {
    const name = `--${family}-${s}`;
    const hex = val(t, name);
    if (!hex || !hex.startsWith('#')) return '';
    return `<div class="ramp__step">
        <div class="ramp__chip" style="background:${hex}"></div>
        <code>${s} ${hex}</code>
      </div>`;
  }).join('\n      ');
  return `      <div style="margin-bottom:var(--space-5)">
        <p class="ah-caps" style="margin:0 0 6px">${esc(family)}</p>
        <div class="ramp">
      ${cells}
        </div>
      </div>`;
}

function neutralRamp(t, steps) { return ramp(t, 'neutral', steps); }

function gradientGrid(t, themeClass) {
  const surfaces = readSurfaces(themeClass);
  const items = [...t.entries()]
    .filter(([n]) => n.startsWith('--gradient-'))
    .map(([n, v]) => {
      const slug = n.replace('--gradient-', '');
      const resolved = val(t, n);
      const textCapable = surfaces.has(slug);
      const stops = gradientStops(resolved);
      return `<div class="grad ah-surface--${slug}"${textCapable ? '' : ` style="background:${resolved}"`}>
          <p class="ah-caps" style="margin:0${textCapable ? '' : ';color:' + inkOn(pickMid(stops))}">${esc(slug)}</p>
          <p class="grad__note" style="margin:0${textCapable ? '' : ';color:' + inkOn(pickMid(stops))}">${
            textCapable ? 'carries text' : 'surface only — text goes in a card'
          }</p>
        </div>`;
    }).join('\n        ');
  /* Wrapped in its own theme class: a specimen of Night's gradients has to
     look like Night even while you are reading the page in Day. */
  return `      <div class="ahimsa-${themeClass} grads" style="background:var(--surface-canvas);border-radius:var(--radius-lg)">\n        ${items}\n      </div>`;
}

function pickMid(stops) {
  if (!stops.length) return '#888888';
  const sorted = [...stops].sort((a, b) => luminance(parseHex(a)) - luminance(parseHex(b)));
  return sorted[Math.floor(sorted.length / 2)];
}

import { readFileSync } from 'node:fs';
function readSurfaces(theme) {
  const css = readFileSync(`src/tokens/${theme}/surfaces.css`, 'utf8');
  const out = new Set();
  for (const m of css.matchAll(/\.ah-surface--([a-z-]+)\s*\{([^}]*)\}/g)) {
    if (/--text-heading/.test(m[2])) out.add(m[1]);
  }
  return out;
}

const TYPE_ROLES = [
  ['ah-display-xl', 'Display XL', 'A screen that is mostly one sentence.'],
  ['ah-display-l', 'Display L', ''],
  ['ah-display-m', 'Display M', ''],
  ['ah-heading-l', 'Heading L', ''],
  ['ah-heading-m', 'Heading M', ''],
  ['ah-title-l', 'Title L', ''],
  ['ah-title-m', 'Title M', ''],
  ['ah-prose', 'Prose', 'Running text. 1rem, and the only size long copy may use.'],
  ['ah-body', 'Body', 'A UI label size. Not for paragraphs.'],
  ['ah-body-serif', 'Body serif', ''],
  ['ah-caption', 'Caption', ''],
  ['ah-label', 'Label', ''],
];

/* ============================== pages ============================== */

const overview = page({
  file: 'index.html',
  title: 'A design system rooted in non-harm',
  lede: 'Ahimsa is a design system with two aesthetics, built on one premise: if a pattern requires the user to lose for the product to win, this system will not produce it.',
  body: `
    <section class="hero">
      <p class="ah-caps ah-caps--rule" style="margin:0">Ahimsa · अहिंसा · v${VERSION}</p>
      <h1 class="ah-display-fluid heading-ink hero__title" style="margin:0">Nothing here is designed to grab you.</h1>
      <p class="ah-prose hero__lede" style="margin:0">
        Ahimsa is a design system rooted in non-harm. It ships colour, type, space
        and motion, ten primitives, and an explicit list of the things it refuses
        to build.
      </p>
      <div class="ah-actions">
        <a class="ah-btn" href="foundations.html">Foundations</a>
        <a class="ah-btn ah-btn--ghost" href="principles.html">Read the principles</a>
      </div>
    </section>

${section('premise', 'The premise', 'One sentence, and everything follows from it',
  `      <blockquote class="ah-quote ah-quote--xl ah-quote--bordered ah-measure" style="margin:0 0 var(--space-6)">
        If a design pattern requires the user to lose for the product to win, this
        system will not produce it.
      </blockquote>`,
  p(`<strong>Ahimsa</strong> (Sanskrit अहिंसा, <em>ahiṃsā</em>) is the ethical
     principle of causing no harm. Applied to design, it means refusing the whole
     vocabulary of extractive UX: no dark patterns, no manufactured urgency, no
     shame-based nudges, no red badge dots.`),
  p(`It belongs to soft-hearted software — journals, personal tools, reading
     tools, well-being and grief-support apps, correspondence tools — anywhere
     the product's success genuinely correlates with the user's wellbeing.`))}

${section('aesthetics', 'Two aesthetics', 'Day and Night',
  p(`Both are the same system. They share the spacing grid, the corner radii, the
     size scale and the easing curves exactly; what changes is colour, the voice
     of the type, and how a surface establishes its edge. Night's accents are
     literally the cool end of Day's palette.`),
  /* Both previews are written in literal colours and literal type, not in
     tokens. A preview of Day has to look like Day even while you are
     reading it in Night — a swatch that restyles itself with the page is
     not showing you anything. */
  `      <div class="pair" style="margin-bottom:var(--space-6)">
        <div style="border-radius:var(--radius-xl);padding:var(--space-6);background:linear-gradient(155deg,#f4a578 0%,#f5be8e 30%,#f6d3a8 60%,#fae7c6 100%);box-shadow:var(--shadow-md)">
          <p style="margin:0 0 var(--space-3);font-family:'DM Sans',system-ui,sans-serif;font-size:0.625rem;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:#1a1310b0">Ahimsa Day</p>
          <p style="margin:0 0 var(--space-3);font-family:Fraunces,Georgia,serif;font-size:1.375rem;line-height:1.15;color:#1a1310">Cream, never white. Warm brown ink, never black.</p>
          <p style="margin:0 0 var(--space-4);font-family:Fraunces,Georgia,serif;font-style:italic;font-size:1.0625rem;line-height:1.35;color:#1a1310d0">The italic serif carries what is felt.</p>
          <p style="margin:0;font-family:'DM Sans',system-ui,sans-serif;font-size:0.8125rem;line-height:1.4;color:#1a1310cc">Editorial and unhurried. Wide-tracked small caps carry what is known, and depth is warm paper shadow.</p>
        </div>
        <div style="position:relative;overflow:hidden;border-radius:var(--radius-xl);padding:var(--space-6);background:radial-gradient(120% 90% at 50% 0%, #1d2a36 0%, #0e131a 55%, #080b10 100%);box-shadow:var(--shadow-md)">
          <div aria-hidden="true" style="position:absolute;inset:-20%;mix-blend-mode:plus-lighter;opacity:.5;background:radial-gradient(38% 28% at 22% 18%,#3b93a340 0,transparent 70%),radial-gradient(30% 24% at 78% 32%,#545fae33 0,transparent 72%)"></div>
          <div style="position:relative">
            <p style="margin:0 0 var(--space-3);font-family:'DM Mono',ui-monospace,monospace;font-size:0.625rem;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:#8ecbd1">Ahimsa Night</p>
            <p style="margin:0 0 var(--space-3);font-family:'DM Sans',system-ui,sans-serif;font-weight:300;font-size:1.375rem;line-height:1.2;letter-spacing:0.02em;color:#eef2f7">Deep blue-black, never pure black. Ice, never pure white.</p>
            <p style="margin:0 0 var(--space-4);font-family:'DM Sans',system-ui,sans-serif;font-weight:200;font-size:1.375rem;line-height:1.45;letter-spacing:0.03em;color:#c3e2ea">The hairline sans carries what is felt.</p>
            <p style="margin:0;font-family:'DM Sans',system-ui,sans-serif;font-size:0.8125rem;line-height:1.45;color:#dce3ec">Futuristic and still. Mono carries what is measured, and depth is hairline and glow rather than shadow.</p>
          </div>
        </div>
      </div>`,
  p(`Switch the aesthetic with the control in the header. Night is <em>not</em> a
     dark mode, and the system deliberately does not wire it to
     <code>prefers-color-scheme</code> — see
     <a class="ah-link" href="principles.html#themes">why</a>.`))}

${section('install', 'Getting started', 'One stylesheet and a class on <html>',
  p(`Put the theme class on <code>&lt;html&gt;</code> rather than
     <code>&lt;body&gt;</code>, so the page background resolves too.`),
  snippet(`<!-- one theme -->
<link rel="stylesheet" href="ahimsa-day.css">
<html lang="en" class="ahimsa-day">

<!-- both, switchable at runtime -->
<link rel="stylesheet" href="ahimsa.css">
<html lang="en" class="ahimsa-night">`),
  p(`Copy <code>fonts/</code> alongside it, licence texts included. Nothing is
     ever fetched from a CDN: a remote font stops working on a plane and tells a
     third party who is using your app.`))}

${section('refuses', 'The short version', 'What this system will not build',
  `      <ul class="ah-prose ah-measure" style="margin:0;padding-left:1.2em;display:grid;gap:var(--space-2)">
        <li><strong>No red.</strong> There is no danger token in either aesthetic. Errors are warm clay or warm copper, because a person who hit a problem has not done something wrong.</li>
        <li><strong>Nothing appears unasked.</strong> No banners, no modals on load, no notification badges, no floating "update available" bar. Version news lives in Settings, behind a control you press.</li>
        <li><strong>No numbers as pressure.</strong> No streaks, no scores, no counts framed as scarcity.</li>
        <li><strong>Leaving weighs the same as continuing.</strong> Every escape hatch is a real control at equal metrics, never grey text.</li>
        <li><strong>No emoji, no icon set.</strong> Type and space carry the meaning.</li>
      </ul>`,
  `      <p style="margin:var(--space-6) 0 0"><a class="ah-link" href="principles.html#refusals">The full list, with the reasoning →</a></p>`)}
`,
});

const foundations = page({
  file: 'foundations.html',
  title: 'Foundations',
  lede: 'Colour, type, space, elevation, motion, and Night\'s ambient layer.',
  body: `
    <section class="hero">
      <p class="ah-caps ah-caps--rule" style="margin:0">Foundations</p>
      <h1 class="ah-display-l heading-ink" style="margin:0">The values, and why each one is what it is</h1>
      <p class="ah-prose hero__lede" style="margin:0">Every swatch and every line below is read out of the shipped token files at build time, so nothing on this page can drift from what you get.</p>
    </section>

${section('colour', 'Colour', 'Never pure white, never pure black',
  p(`The canvas is warm cream and the darkest ink is a warm brown. Pure black on
     pure white is a harsher contrast than any screen needs, and it reads as
     clinical — so the system does not contain either. Night holds the same law
     from the other end: its deepest ground is <code>#080b10</code> and its
     lightest ink <code>#eef2f7</code>.`),
  `      <div class="spec" style="margin-bottom:var(--space-6)">
        <p class="ah-caps" style="margin:0">Neutrals — Day</p>
${neutralRamp(DAY, [50, 100, 200, 300, 400, 500, 600, 700, 800, 900])}
        <p class="ah-caps" style="margin:0">Neutrals — Night</p>
${neutralRamp(NIGHT, [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950])}
      </div>`,
  p(`<strong>Day's accents, the recommended family</strong>, are named for the
     tradition the system takes its ethics from: saffron for renunciate robes,
     turmeric for ritual gold, clay for earthen lamps, bodhi for the fig tree of
     awakening, peacock for India's bird, indigo for the Champaran satyagraha
     crop, monsoon for grey-blue rain skies. Nothing high-chroma, nothing poppy.`),
  `      <div class="spec" style="margin-bottom:var(--space-6)">
        <p class="ah-caps" style="margin:0">Day · the ahimsa-tradition set</p>
${TRADITION.map((f) => ramp(DAY, f, [300, 400, 500, 600, 700])).join('\n')}
      </div>`,
  p(`<strong>The classic family</strong> is the original accent set, kept because
     a consuming app built a full range of person-gradients directly on it. One
     rename: its blue-violet is <code>--periwinkle-*</code>, because it used to
     be called <code>--indigo-*</code> at a different value from the tradition
     set's indigo, and two different colours cannot share one name.`),
  `      <div class="spec" style="margin-bottom:var(--space-6)">
        <p class="ah-caps" style="margin:0">Day · the classic set</p>
${CLASSIC.map((f) => ramp(DAY, f, [300, 400, 500, 600, 700])).join('\n')}
      </div>`,
  p(`<strong>Night reuses Day's cool hues</strong> unchanged at 300–700, each
     gaining a lighter 200 step because a dark ground needs brighter ink. Only
     two families are new: frost, which is Night's cream, and ember, its only
     warning hue.`),
  `      <div class="spec">
        <p class="ah-caps" style="margin:0">Night</p>
${NIGHT_FAMILIES.map((f) => ramp(NIGHT, f, [200, 300, 400, 500, 600, 700])).join('\n')}
      </div>`)}

${section('gradients', 'Gradients', 'One gradient owns a screen',
  p(`All of them run at 155°, with stops at 0 / 30 / 60 / 100%. They are moments
     of emphasis, not decoration — flat cream, or flat deep blue, is the default.
     Two gradients side by side is the rule this system breaks least gladly.`),
  p(`Each one ships as <code>.ah-surface--&lt;name&gt;</code>, which sets the
     gradient <em>and</em> the ink measured to work on it. A 155° ramp spans a
     wide lightness range, so no single ink can carry text across all of it; the
     surface therefore carries its own. Five of Day's gradients cannot clear AA
     at any ink opacity and are marked surface-only — put text on them in an
     opaque card, which is this system's pattern anyway.`),
  `      <p class="ah-caps" style="margin:0 0 var(--space-3)">Day</p>`,
  gradientGrid(DAY, 'day'),
  `      <p class="ah-caps" style="margin:var(--space-8) 0 var(--space-3)">Night</p>`,
  gradientGrid(NIGHT, 'night'))}

${section('type', 'Type', 'Two voices, and the split is the tone',
  p(`Day pairs <strong>Fraunces</strong>, a variable serif carrying emotional
     weight, with <strong>DM Sans</strong> for utility. Night has no serif at
     all: <strong>DM Sans</strong> at hairline weights carries what is felt, and
     <strong>DM Mono</strong> carries what is measured. In both, an emotional
     line is set apart and a factual line stays plain.`),
  p(`The size scale is musical and deliberately uneven — there is no 12px and no
     14px. It is expressed in <code>rem</code> at the same computed sizes it has
     always rendered, so raising your browser's font size actually works.`),
  `      <div class="spec" style="margin-bottom:var(--space-6)">
${TYPE_ROLES.map(([cls, label, note]) => `        <div style="border-bottom:1px solid var(--border-subtle);padding-bottom:var(--space-3)">
          <p class="ah-caps" style="margin:0 0 6px">${esc(label)} · <code>.${cls}</code></p>
          <p class="${cls}" style="margin:0">Nothing here is designed to grab you.</p>
${note ? `          <p class="ah-body muted" style="margin:6px 0 0">${esc(note)}</p>` : ''}
        </div>`).join('\n')}
      </div>`,
  `      <div class="pair">
        <div class="spec">
          <p class="ah-caps" style="margin:0">The two signature styles</p>
          <div class="spec__demo spec__demo--stack spec__demo--pad">
            <p class="ah-small-caps" style="margin:0">Small caps · the utility voice</p>
            <p class="ah-pull-quote" style="margin:var(--space-3) 0 0">A supporting line, quietly offered.</p>
          </div>
          <p class="ah-body secondary" style="margin:0">Wide-tracked uppercase for what is known; the emotional register for what is felt. Never quotation marks on a pull quote — the setting is already doing that job.</p>
        </div>
        <div class="spec">
          <p class="ah-caps" style="margin:0">Fluid display</p>
          <div class="spec__demo spec__demo--pad">
            <p class="ah-display-fluid" style="margin:0;font-size:clamp(2rem,6vw,4rem)">Begin</p>
          </div>
          <p class="ah-body secondary" style="margin:0">Day pulls display type tight (<code>-0.045em</code>); Night opens it out (<code>+0.03em</code>). Same class, opposite gesture.</p>
        </div>
      </div>`)}

${section('space', 'Space', 'A 4px grid, composed like a magazine',
  p(`The grid is mechanical; the composition is not. Generous negative space is a
     principle, not a preference: at least one full unit of air above and below a
     heading, and <em>if a section feels crowded, remove elements before
     shrinking type.</em>`),
  `      <div class="spec" style="margin-bottom:var(--space-6)">
        <p class="ah-caps" style="margin:0">Spacing scale</p>
        <div style="display:grid;gap:6px">
${[0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24].map((s) => {
  const v = val(DAY, `--space-${s}`);
  return `          <div style="display:flex;align-items:center;gap:var(--space-4)">
            <code class="ah-body muted" style="width:6.5rem;flex-shrink:0;font-family:var(--font-mono)">--space-${s}</code>
            <div style="height:12px;width:${v};background:var(--accent-primary);border-radius:2px;flex-shrink:0"></div>
            <span class="ah-body muted">${v}</span>
          </div>`;
}).join('\n')}
        </div>
      </div>`,
  `      <div class="spec">
        <p class="ah-caps" style="margin:0">Radius — rounded at every scale, never sharp</p>
        <div class="spec__demo">
${['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map((r) => `          <div style="width:76px;height:76px;background:var(--surface-sunk);border-radius:var(--radius-${r});display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px">
            <code class="ah-body muted" style="font-family:var(--font-mono);font-size:var(--size-micro)">${r}</code>
          </div>`).join('\n')}
        </div>
        <p class="ah-body secondary ah-measure" style="margin:0">Sharp corners in an interface carry an implicit threat; rounded corners carry receptiveness. This is a system law rather than a Day preference, which is why Night's radii are identical.</p>
      </div>`)}

${section('elevation', 'Elevation', 'Paper in Day, light in Night',
  p(`Day's shadows are warm brown-tinted and layered, never harsh and never
     black. <code>--shadow-md</code> carries an inner white highlight, and that
     highlight is what makes a card read as paper rather than as a floating
     rectangle.`),
  p(`Night cannot use shadow — a drop shadow is invisible on a dark ground. The
     same token names do a different job there: an inset hairline ring
     establishes the edge, an inner top highlight suggests a lit surface, and
     emphasis comes from <code>--glow-*</code> rather than from a brighter fill.`),
  `      <div class="spec">
        <p class="ah-caps" style="margin:0">The shadow scale</p>
        <div class="spec__demo spec__demo--pad" style="gap:var(--space-6);padding:var(--space-8)">
${['xs', 'sm', 'md', 'lg', 'xl'].map((s) => `          <div style="width:96px;height:96px;background:var(--surface-elevated);border-radius:var(--radius-lg);box-shadow:var(--shadow-${s});display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px">
            <code class="ah-body muted" style="font-family:var(--font-mono);font-size:var(--size-micro)">${s}</code>
          </div>`).join('\n')}
        </div>
      </div>`)}

${section('motion', 'Motion', 'Settling, not pouncing',
  p(`Nothing snaps and nothing overshoots. Every easing curve in the system ends
     at 1.0 with no value above it, which is a mechanical guarantee that no
     transition can bounce. A press shrinks by 3%; a sheet rises over 550ms and
     decelerates into place. Motion mimics settling, not predator movement.`),
  `      <div class="spec">
        <p class="ah-caps" style="margin:0">Durations and easings</p>
        <table class="tbl">
          <thead><tr><th>Token</th><th>Value</th><th>For</th></tr></thead>
          <tbody>
${[['--duration-instant', 'the smallest acknowledgements'],
   ['--duration-fast', 'hover and press'],
   ['--duration-base', 'state changes'],
   ['--duration-slow', 'card flips'],
   ['--duration-slower', 'sheet slide-ups'],
   ['--duration-slowest', 'onboarding transitions'],
   ['--duration-reveal', 'clip-path wipes of a large surface'],
   ['--ease-standard', 'small state changes'],
   ['--ease-emphasized', 'carousels, card reveals, sheets'],
   ['--ease-decelerate', 'anything entering'],
   ['--ease-accelerate', 'anything leaving'],
   ['--ease-reveal', 'clip-path wipes'],
   ['--ease-expo', 'a long, soft settle']].map(([t, why]) =>
  `            <tr><td><code>${t}</code></td><td><code>${esc(val(DAY, t) || '')}</code></td><td class="secondary">${esc(why)}</td></tr>`).join('\n')}
          </tbody>
        </table>
        <p class="ah-body secondary ah-measure" style="margin:0">Under <code>prefers-reduced-motion</code> the system removes animation outright rather than shortening it — and it does <em>not</em> lower durations, because reduced motion must not mean slower or less legible, only stiller.</p>
      </div>`)}

${section('ambient', 'Ambient', 'Night\'s field, and why it asks for nothing',
  p(`Night ships an optional decorative layer: a dark field with additive bloom,
     film grain, scanlines, a vignette, and line geometry. The references for it
     are WebGL pieces with a full postprocessing chain — but additive blending is
     <code>mix-blend-mode: plus-lighter</code>, noise is
     <code>feTurbulence</code>, scanlines are a repeating gradient, and RGB shift
     is a per-channel <code>feOffset</code>. None of it needs a renderer, a
     canvas, or a byte of JavaScript.`),
  `      <div class="spec" style="margin-bottom:var(--space-6)">
        <p class="ah-caps" style="margin:0">The layer, composed</p>
        <div style="position:relative;min-height:280px;border-radius:var(--radius-xl);overflow:hidden;background:#0e131a">
          <div class="ah-ambient ah-ambient--void ah-ambient--bloom ah-ambient--grain ah-ambient--isolines ah-ambient--vignette" aria-hidden="true"></div>
          <div style="position:relative;z-index:1;padding:var(--space-8);display:grid;gap:var(--space-3);place-content:center;min-height:280px;text-align:center">
            <p class="ah-small-caps" style="margin:0;font-family:var(--font-mono);color:#8ecbd1">ambient · decorative · aria-hidden</p>
            <p style="margin:0;font-family:var(--font-body);font-weight:200;font-size:clamp(1.75rem,5vw,2.75rem);letter-spacing:0.03em;color:#eef2f7;line-height:1.1">It has nothing to tell you.</p>
          </div>
        </div>
        <p class="ah-body secondary ah-measure" style="margin:0">Switch to Night to see it against the rest of the system.</p>
      </div>`,
  `      <div class="ah-card ah-card--sunk">
        <p class="ah-caps" style="margin:0 0 var(--space-3)">Hard constraints, not stylistic ones</p>
        <ul class="ah-body" style="margin:0;padding-left:1.2em;display:grid;gap:var(--space-2)">
          <li>It never encodes state or progress. Nothing can be missed by ignoring it.</li>
          <li>It never reacts to error. A glitch effect on failure tells someone their screen is broken.</li>
          <li>It never flashes. Nothing pulses faster than 0.1Hz and no animation is shorter than 2s — well outside WCAG 2.3.1's three-flash threshold.</li>
          <li>It animates opacity and hue only, never position. Movement in peripheral vision is a demand for attention.</li>
          <li>It disappears entirely under <code>prefers-reduced-motion</code>, <code>prefers-reduced-transparency</code>, and <code>forced-colors</code>.</li>
        </ul>
        <p class="ah-body secondary" style="margin:var(--space-4) 0 0">Spectacle that asks for nothing is the only kind this system allows. <code>tools/check-attention.mjs</code> enforces the timing and the no-transform rule.</p>
      </div>`)}
`,
});

writeFileSync('docs/index.html', overview);
writeFileSync('docs/foundations.html', foundations);
console.log('docs/index.html');
console.log('docs/foundations.html');

/* ---------- the rest of the site ---------- */
const { components, patterns } = await import('./build-docs-2.mjs');
const { principles, accessibility, agents } = await import('./build-docs-3.mjs');
writeFileSync('docs/components.html', components);
writeFileSync('docs/patterns.html', patterns);
writeFileSync('docs/principles.html', principles);
writeFileSync('docs/accessibility.html', accessibility);
writeFileSync('docs/agents.html', agents);
for (const f of ['components', 'patterns', 'principles', 'accessibility', 'agents']) console.log(`docs/${f}.html`);
