/* Shared shell + helpers for the documentation site generator. */
import { readTokens } from './lib/css-tokens.mjs';
import { readFileSync } from 'node:fs';
import { parseHex, over, contrast, gradientStops, resolve, luminance } from './lib/color.mjs';

export const VERSION = JSON.parse(readFileSync('package.json', 'utf8')).version;

export const NAV = [
  ['index.html', 'Overview'],
  ['foundations.html', 'Foundations'],
  ['components.html', 'Components'],
  ['patterns.html', 'Patterns'],
  ['principles.html', 'Principles'],
  ['accessibility.html', 'Accessibility'],
  ['agents.html', 'For agents'],
];

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export function tokens(theme) {
  return readTokens([
    'src/tokens/shared.css',
    `src/tokens/${theme}/palette.css`,
    `src/tokens/${theme}/gradients.css`,
    `src/tokens/${theme}/semantic.css`,
    `src/tokens/${theme}/elevation.css`,
  ]);
}

export function val(t, name) { return resolve(t, t.get(name)); }

/* Pick ink that reads on a given swatch, so the specimen labels themselves
   are legible. A colour chart you cannot read is not a colour chart. */
export function inkOn(hex) {
  const bg = parseHex(hex);
  if (!bg) return '#141414';
  const dark = parseHex('#1a1310'), light = parseHex('#eef2f7');
  return contrast(dark, bg) >= contrast(light, bg) ? '#1a1310' : '#eef2f7';
}

export function page({ file, title, lede, body, theme = 'day' }) {
  const nav = NAV.map(([href, label]) =>
    `<a class="ah-link ah-link--quiet ah-body" href="${href}"${href === file ? ' aria-current="page"' : ''}>${label}</a>`
  ).join('\n          ');

  return `<!DOCTYPE html>
<html lang="en" class="ahimsa-${theme}">
<head>
<meta charset="utf-8">
<!-- viewport-fit=cover for safe areas. Note what is absent: no
     maximum-scale, no user-scalable=no. Pinch zoom always stays. -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ebe6df">
<meta name="color-scheme" content="light dark">
<title>${esc(title)} — Ahimsa Design System</title>
<meta name="description" content="${esc(lede)}">
<link rel="stylesheet" href="ahimsa.css">
<link rel="stylesheet" href="site.css">
</head>
<body>
<a class="ah-visually-hidden" href="#main">Skip to content</a>
<div class="ah-page">

  <header class="site-head">
    <a class="site-mark" href="index.html">Ahimsa</a>
    <nav class="site-nav" aria-label="Sections">
      ${nav}
    </nav>
    <div class="theme-switch" role="group" aria-label="Aesthetic">
      <button class="ah-pill ah-pill--outline ah-hit" data-theme-btn="day" aria-pressed="true">Day</button>
      <button class="ah-pill ah-pill--outline ah-hit" data-theme-btn="night" aria-pressed="false">Night</button>
    </div>
  </header>

  <main id="main">
${body}
  </main>

  <footer class="site-foot">
    <p class="ah-caption" style="margin:0">Ahimsa Design System v${VERSION} · MIT · fonts under SIL OFL-1.1</p>
    <p class="ah-caption" style="margin:0">No analytics. No cookies. Nothing here is loaded over a network.</p>
  </footer>

</div>
<script src="site.js"></script>
</body>
</html>
`;
}

export function section(id, kicker, heading, ...blocks) {
  return `    <section class="ah-section" id="${id}">
      <p class="ah-caps ah-caps--rule" style="margin:0 0 var(--space-4)">${esc(kicker)}</p>
      <h2 class="ah-display-m" style="margin:0 0 var(--space-5)">${esc(heading)}</h2>
${blocks.join('\n')}
    </section>`;
}

export function p(text, cls = 'ah-prose ah-measure') {
  return `      <p class="${cls}" style="margin:0 0 var(--space-4)">${text}</p>`;
}

export function snippet(code) {
  return `      <div class="snippet">
        <pre tabindex="0"><code>${esc(code)}</code></pre>
        <button class="ah-btn ah-btn--sm ah-btn--ghost snippet__copy" data-copy type="button">Copy</button>
      </div>`;
}

export function spec({ label, demo, code, note, padded = false }) {
  return `      <div class="spec">
        <p class="ah-caps" style="margin:0">${esc(label)}</p>
        <div class="spec__demo${padded ? ' spec__demo--pad' : ''}">${demo}</div>
${note ? `        <p class="ah-body secondary ah-measure" style="margin:0">${note}</p>` : ''}
${code ? snippet(code) : ''}
      </div>`;
}

export { parseHex, over, contrast, gradientStops, resolve, luminance };
