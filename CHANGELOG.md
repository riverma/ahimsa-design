# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.1.0] - 2026-10-16

Day's sky is a light gray with soft white clouds, in place of the warm haze
and the sun. No token value moves, so this is a minor release: `.ah-sky`
composes two new tokens instead of two existing ones.

### Changed

- **`.ah-sky` is a light gray sky with soft white clouds.** A quiet neutral
  gray, a touch deeper overhead, under three large cloud banks blurred until
  no edge survives. They sit in a fixed arrangement and never move: Day's
  counterpart to Night's stars. The docs site's Day ground follows.

### Added

- `--gradient-sky`: the sky, top to bottom (180deg, the one exception to
  155deg besides cream), with a generated `.ah-surface--sky`.
- `--ambient-clouds`: the clouds as a static SVG, in the new
  `src/ambient/clouds.css`, shipped in the Day and combined bundles. Each
  puff is translucent white, so nothing is pure white.

### Deprecated

- `--gradient-sun`. `.ah-sky` no longer uses it; 4.0 removes it.
  `--gradient-dawn` stays, as a surface of its own.

### Fixed

- The docs site now shows its sky. `.ah-page` painted the flat canvas over
  the page background, so neither 3.0's sun nor Night's stars were visible
  behind the docs.

## [3.0.0] - 2026-10-16

Both aesthetics are recolored, Night now speaks in Day's type, and Night now
follows the operating system's light or dark preference by default. This is
breaking: token values in Day and Night change, and two applications render
them.

### Changed

- **Day is lit by a sun.** Warm paper (Chalk cards, Cocoa ink) under a Soft
  Haze sky. `--gradient-dawn` is now the sky and the new `--gradient-sun` is
  the light falling on it from the top left; together they are `.ah-sky`.
  `--gradient-cream` and every tradition gradient were regenerated.
- **The accents were chosen, not derived.** Marigold Robe (saffron), Gold Leaf
  (turmeric), Kiln (clay), Young Leaf (bodhi), Verdigris (peacock), Champaran
  (indigo), Rain Cloud (monsoon). Each is the `-600` step of its family in
  Day. Token slugs are unchanged; the names are documented in Foundations.
  `--accent-primary` is now `peacock-600`.
- **Night keeps those hues, one step lighter.** Ghee, Gold Dust, Low Embers,
  Fig Leaf, Glacier Lake, Nila, Rain Cloud, each the `-300` step. Saffron,
  turmeric and clay join Night's palette; the ember family is gone and
  warnings are clay. The ground is Midnight Blue with a Deep Well card and
  Frost ink.
- **Night uses Day's type.** Fraunces and DM Sans, the same weights, the same
  display tracking. The ultralight sans and the mono voice are gone.
- **Night follows the operating system.** The documentation no longer says
  Night is not a dark mode. With no stored choice, an app should start in
  Night when `prefers-color-scheme` is dark, and a choice made in the app
  always wins. The docs site does exactly this.
- **American English throughout** (`color`, `gray`, `license`, `labeled`).
- The parity baseline was re-baselined to the new Day values.
- **The primary button is the brand accent**: Verdigris in Day, Glacier Lake
  in Night, with `--text-inverse` as its label. It was ink on paper.
- **Links use the interactive accent** (`--accent-secondary`: Champaran in Day,
  Nila in Night). `.ah-link--quiet` still inherits, for navigation.

### Added

- `.ah-ambient--stars`: a faint, static, fixed-arrangement starfield for Night.
- `.ah-sky`: Day's counterpart, a warm haze with the sun at the top left.
- `--gradient-midnight` (Night's sky) and `--gradient-sun` (Day's light).
- `--ambient-stars`, the starfield as a custom property.
- The contrast gate now measures the primary button's label against
  `--accent-primary` (4.79:1 in Day, 10.65:1 in Night).

### Removed

- **DM Mono** and `fonts/night.css`: Night no longer needs a second family.
  `--font-mono` is the system monospace in both aesthetics.
- Night's `ember-*` palette family.

## [2.0.0] - 2026-10-11

Day moves from warm cream to newsprint. This is breaking: color, gradient
and shadow values in Day change, and two applications render them.

### Changed

- **Ahimsa Day is now newsprint.** Paper-gray canvas, off-white cards, and
  near-black ink with a faint cool tint, in step with Night's blue-black.
  Primary buttons are ink on paper.
- **Accents are a hint, not a palette.** Every ramp is desaturated; the primary
  accent and focus ring are deep peacock, links and active tabs are indigo.
- **All Day gradients are muted**, and `dawn` and `cream` are paper grays.
  Gradient surface classes were regenerated with re-measured ink.
- **Shadows, scrim and the docs preview card** are tinted to the new ink.
- **The system is described as platform-neutral**: for phone, desktop and web
  interfaces. The CSS is the web reference implementation; `tokens.json`
  carries the values to other toolkits.
- The parity baseline was re-baselined to the new Day values.

### Removed

- A reference to grief-support apps in the overview copy.

## [1.0.0] - 2026-09-26

First release. Extracts a design system that had been living inside a single
application, gives it a second aesthetic, and writes down the things it
refuses to build.

### Added

- **Ahimsa Day** — the warm editorial aesthetic, transcribed from the original
  token package: warm cream neutrals, fourteen accent ramps, twenty-one 155°
  gradients, a 4px spacing grid, rounded radii at every scale, warm
  paper-tinted shadows, and six durations with four non-overshooting easings.
- **Ahimsa Night** — a second aesthetic built from the cool end of Day's
  palette. Deep blue-black grounds, hairline-and-glow elevation instead of
  shadow, an inverted type voice (ultralight sans for what is felt, mono for
  what is measured), seven atmospheric gradients, and an optional ambient
  field with additive bloom, grain, scanlines and line geometry — all in CSS
  and SVG, with no canvas and no JavaScript.
- **Gradient surface classes.** `.ah-surface--<name>` sets a gradient and the
  ink measured against its worst stop, because no single ink can carry text
  across a 155° ramp. Generated by `tools/build-surfaces.mjs`.
- **Ten primitives** as framework-free CSS: button, pill, link, field, toggle
  chip, card, sheet, small-caps label, pull quote, monogram, progress dots,
  status dot, section rule, toast, notice.
- **The attention principle**, as a first-class rule and a build gate. Nothing
  appears unasked: no banners, no modals on load, no floating update bars, no
  `role="alert"`, no `aria-live="assertive"`, no autoplay, no `setInterval`.
  `.ah-notice` plus a Settings version check replace them.
- **Documentation site** at `ahimsa-design.riverma.com`, built with the system
  it documents, with a live Day/Night switch.
- **`tokens.json`** — every token in both aesthetics, W3C DTCG format.
- **`SKILL.md`** — an entry point for agents generating interfaces.
- **Five gates** run by `npm run check` and `npm run check:a11y`: token
  parity, contrast, attention, offline, and axe-core across both aesthetics at
  320/390/1280px and 200% zoom.

### Changed

Deviations from the token set this was extracted from, each declared in
`tools/check-parity.mjs` so the gate still catches anything undeclared:

- `--text-secondary` 65% → 76% alpha. The original measures 3.64:1 against the
  darkest Day ground and fails AA for the descriptions it exists to set.
- `--text-muted` 45% → 60% alpha, and redefined as a **non-text** token. Even
  raised it reaches only ~3.2:1, so no component sets type in it; the
  small-caps label that used to now uses `--text-secondary`.
- `--text-faint` 28% → 40% alpha, and redefined as hints only. No component
  uses it.
- The type scale moved from `px` to `rem` at identical computed sizes, so that
  raising a browser's font size actually works.
- `--accent-warning-surface` (a destructive control's fill) uses `clay-600`
  rather than `clay-500`: the inherited choice puts its own label at 4.08:1.

138 of the 141 original token values are preserved byte-for-byte.

### Removed

- The React component bundle. It rendered inline styles only, so it had no
  `:hover` and no `:focus-visible`, and it faked press feedback with
  `onMouseDown` — mouse-only, dead on touch, and a pointer-cancellation
  failure. The CSS layer is canonical.
- The JSX-only adherence lint config, which had nothing to say about CSS.
- Loading fonts from a CDN. Self-hosting is the only supported path.

### Fixed

- **A visible focus ring.** The system this was extracted from had no
  `:focus-visible` rule anywhere and reset outlines on inputs, leaving
  keyboard users with nothing.
- **Forced-colors support** for every component. Windows High Contrast
  discards glass and gradients, and this system is built on both.
- **Input font size** raised to 1rem. Safari on iOS zooms the viewport when a
  field under 16px takes focus, and a zoomed fixed-position app cannot be
  scrolled — which reads as the app breaking the moment you try to type.
- **Pagination dots are real 44px buttons** rather than 5px dots with an
  invisible hit area, so an audit can see what a finger could already reach.
- **A name collision.** Two different blue-violets were both called
  `--indigo-*`; the lighter one is now `--periwinkle-*`.

[Unreleased]: https://github.com/riverma/ahimsa-design/compare/v3.1.0...HEAD
[3.1.0]: https://github.com/riverma/ahimsa-design/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/riverma/ahimsa-design/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/riverma/ahimsa-design/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/riverma/ahimsa-design/releases/tag/v1.0.0
