# Working in this repository

## What this is

A design system: tokens, a framework-free CSS component layer, a generated
`tokens.json`, and a documentation site. It has **no runtime dependencies**
and must keep none. The only devDependency is `axe-core`, used by the
accessibility gate.

## Before you commit

```bash
npm run build        # dist/, docs/ahimsa.css, docs/fonts/, tokens.json
npm run check        # parity · contrast · attention · offline
npm run check:a11y   # axe, both aesthetics, 4 widths  (needs the site served)
```

`npm run serve` puts the docs site on <http://127.0.0.1:8173>, which the two
browser-driven tools expect. They run WebKit — see `tools/shots.mjs` for why.
Playwright is optional and not a dependency of this package: install it
(`npm i -D @playwright/test && npx playwright install webkit`) or point at a
checkout that already has it with `AHIMSA_PLAYWRIGHT_FROM=/path/package.json`.

Generated files must be regenerated, not hand-edited:
`src/tokens/*/surfaces.css`, `dist/*`, `docs/*.html`, `docs/ahimsa.css`,
`docs/fonts/*`, `tokens.json`.

## The five gates, and what each is protecting

- **`check-parity.mjs`** — Ahimsa Day is a restructure of a system already
  shipping in two applications. Every canonical value must still resolve to
  the same thing. If a change genuinely needs to move one, add it to
  `DEVIATIONS` with a reason; the gate then fails if it *stops* deviating, so
  the bookkeeping cannot rot.
- **`check-contrast.mjs`** — composites translucent ink onto its real ground,
  across both aesthetics and every gradient stop.
- **`check-attention.mjs`** — the pull model, mechanically. A principle nobody
  checks is a preference.
- **`check-offline.mjs`** — nothing is loaded over a network.
- **`check-a11y.mjs`** — axe plus the things axe cannot see: target size,
  forced-colors coverage, suppressed focus, px font sizes.

If a gate fails, fix the thing rather than the gate. If the gate is genuinely
wrong, fix it *and* prove it still catches a real violation — plant one, watch
it fail, remove it.

## Design rules that are not style preferences

- **No red.** There is no danger token. Do not add one.
- **Nothing appears unasked.** No banner, no modal on load, no floating bar,
  no `role="alert"`, no `aria-live="assertive"`, no autoplay, no
  `setInterval`. `.ah-notice` plus a Settings version check is the answer.
- **Components reference semantic tokens only**, never a palette step. That is
  what makes markup portable between Day and Night.
- **`--text-muted` is a non-text token.** It measures around 3:1. Never set
  type in it; use `--text-secondary`.
- **`--border-control`, not `--border-strong`,** for the edge of an
  interactive control. The latter is a decorative separator.
- **Corners stay rounded** in both aesthetics. Sharp corners in an interface
  carry an implicit threat; this is a system law, not a Day preference.
- **Every easing ends at 1.0.** No overshoot, ever.

## Releases

Semantic versioning, `vMAJOR.MINOR.PATCH`, starting at `v1.0.0`. Patch for a
fix, minor for a feature, major for a breaking change — and a token value
moving is breaking, because two applications render it.

On every commit, pick the bump and update all three together:

1. `version` in `package.json`
2. the entry in `CHANGELOG.md` (Keep a Changelog format)
3. the footer label on the docs site — which reads `package.json`, so
   `npm run build` handles it

Cut a GitHub release on every major and minor bump:

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes "…"
```

No CI. Releases are cut by hand; keep the repository free of build bloat.

## Standing constraints

- Never push without an explicit go-ahead. Screenshots of any visual change go
  out for review first.
- Run a security review of the diff before any push.
- Commit messages are plain. No AI attribution trailers.
