# Ahimsa Design System

A design system rooted in **non-harm**, with two aesthetics.

> If a design pattern requires the user to lose for the product to win, this
> system will not produce it.

**Ahimsa** (Sanskrit अहिंसा, *ahiṃsā*) is the ethical principle of causing no
harm. Applied to interface design it means refusing the whole vocabulary of
extractive UX: no dark patterns, no manufactured urgency, no shame-based
nudges, no red badge dots, and nothing that appears unasked.

**[ahimsa-design.riverma.com](https://ahimsa-design.riverma.com)** — the
documentation site, built with the system it documents.

## The two aesthetics

|  | **Ahimsa Day** | **Ahimsa Night** |
|---|---|---|
| Ground | Warm cream, never white | Deep blue-black, never pure black |
| Ink | Warm brown, never black | Ice, never pure white |
| Felt | Italic serif (Fraunces) | Ultralight sans (DM Sans 200) |
| Known | Wide-tracked small caps | Mono small caps (DM Mono) |
| Depth | Warm paper shadow | Hairline and glow |
| Emphasis | One 155° gradient per screen | One atmospheric field per screen |

They are the same system. The spacing grid, the corner radii, the size scale
and the easing curves are identical in both, and Night's accents are literally
the cool end of Day's palette — peacock, indigo, monsoon and bodhi carry across
unchanged. What differs is colour, the voice of the type, and how a surface
establishes its edge.

Night is **not a dark mode.** It is a sibling aesthetic that happens to be
dark, and the system deliberately does not wire it to `prefers-color-scheme`.

## Quick start

```html
<!-- one aesthetic -->
<link rel="stylesheet" href="ahimsa-day.css">
<html lang="en" class="ahimsa-day">

<!-- both, switchable at runtime -->
<link rel="stylesheet" href="ahimsa.css">
<html lang="en" class="ahimsa-night">
```

Put the theme class on `<html>`, not `<body>`, so the page background resolves
too. Copy `fonts/` next to the stylesheet, licence texts included.

```html
<div class="ah-card">
  <p class="ah-caps">Last together</p>
  <p class="ah-heading-m">A quiet place to begin.</p>
  <div class="ah-actions">
    <button class="ah-btn" type="button">Continue</button>
    <button class="ah-btn ah-btn--ghost" type="button">Not now</button>
  </div>
</div>
```

Nothing is ever fetched over a network. A remote font stops working on a plane
and tells a third party who is using your app.

## What it will not build

- **No red, and no danger token** in either aesthetic. Errors are warm clay or
  warm copper, because a person who hit a problem has not done something wrong.
- **Nothing appears unasked.** No banners, no modals on load, no notification
  badges, no floating "update available" bar, no push, no autoplay. Version
  news lives in Settings, behind a control you press.
- **No numbers as pressure.** No streaks, no scores, no manufactured scarcity.
- **Leaving weighs the same as continuing.** Every escape hatch is a real
  control at equal metrics, never grey text, never confirmshaming.
- **No emoji, no icon set.** Type and space carry the meaning.

The full list, with the reasoning, is in
[the principles](https://ahimsa-design.riverma.com/principles.html#refusals).
Adopting the look without the refusals produces something merely warm, which is
worse than neither — the warmth is not camouflage.

## Accessibility

Target is **WCAG 2.2 AA**, checked by machine rather than claimed, with a
per-criterion conformance table — including what is only partially met — on
[the accessibility page](https://ahimsa-design.riverma.com/accessibility.html).

```bash
npm run check        # token parity, contrast, attention, offline
npm run check:a11y   # axe-core, both aesthetics, 320/390/1280px and 200% zoom
```

The contrast gate composites translucent ink onto its real ground before
measuring — quiet text here is the ink colour at low alpha, and a ratio
computed without compositing is meaningless.

## What's in the box

```
dist/ahimsa-day.css      one aesthetic, flattened, self-contained
dist/ahimsa-night.css    the other
dist/ahimsa.css          both, theme-scoped
dist/CHECKSUMS           sha256 per file, for a pinned vendored copy
fonts/                   6 woff2 + 3 OFL licence texts
tokens.json              every token, both aesthetics, W3C DTCG format
src/                     the authoring source — edit this, not dist/
docs/                    the documentation site
SKILL.md                 the brief for an agent generating an interface
```

Build with `npm run build`. There are no runtime dependencies; the only
devDependency is `axe-core`, used by the accessibility gate.

## Contributing

Issues and pull requests are welcome. Two things to know before opening one:

- **The refusals are not up for negotiation on a case-by-case basis.** A
  proposal to add a notification badge, an alert colour, or a banner will be
  declined — not because the implementation would be bad, but because the
  absence is the product.
- **`npm run check` must pass.** The token-parity gate in particular exists to
  stop a value quietly moving under two applications that already ship it. If
  a change genuinely needs to move one, declare it in `DEVIATIONS` with a
  reason, and the gate will hold you to it.

See [CHANGELOG.md](CHANGELOG.md) for version history and
[PRIVACY.md](PRIVACY.md) for the privacy notice.

## Versioning

Semantic versioning. The version is shown in the documentation site footer and
matches the latest `CHANGELOG.md` entry. Major and minor bumps are cut as
GitHub releases.

## Provenance

Ahimsa grew inside two applications before it had a repository, and the
original upstream package it was transcribed from — a `tokens.json`, a
`COMPLIANCE.md`, and a set of guideline cards — no longer exists anywhere. The
CSS in `src/tokens/` is therefore canonical, `tokens.json` is generated from
it, and the refusals were reconstructed from the reasoning left behind in two
codebases. Where something is a reconstruction rather than a recovered
document, the docs say so.

## Licence

[MIT](LICENSE) for the system, so that using it costs you nothing.

The bundled typefaces are **not** MIT: Fraunces, DM Sans and DM Mono are each
under the SIL Open Font License 1.1, and their licence texts must travel with
the binaries in any redistribution.
