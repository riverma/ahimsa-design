---
name: ahimsa-design
description: Build an interface with the Ahimsa design system — a non-harm design language with two aesthetics (Day, warm and editorial; Night, dark and futuristic). Use when generating UI that should be calm, non-extractive, and accessible, or when a project already ships Ahimsa tokens.
---

# Ahimsa Design System

A design system rooted in non-harm, with two aesthetics. One premise:

> If a design pattern requires the user to lose for the product to win, this
> system will not produce it.

## Setup

Link one stylesheet and put the theme class on `<html>`:

```html
<link rel="stylesheet" href="ahimsa-day.css">
<html lang="en" class="ahimsa-day">     <!-- or class="ahimsa-night" -->
```

Copy `fonts/` next to it, including the three `OFL-*.txt` files. **Never load
a font, a script or a stylesheet over a network.** Never set
`maximum-scale` or `user-scalable=no` on the viewport.

Day and Night define an identical set of semantic token names. Reference
semantics only — never a palette step like `--saffron-600` — and markup works
unchanged in both.

## Tokens

```
surfaces   --surface-canvas  --surface-canvas-flat  --surface-elevated
           --surface-sunk  --surface-inverse
text       --text-heading  --text-body  --text-secondary  --text-muted
           --text-faint  --text-inverse
borders    --border-subtle  --border-medium  --border-strong  --border-control
accents    --accent-primary  --accent-secondary  --accent-success
           --accent-warning  --accent-warning-surface
focus      --focus-ring  --focus-ring-width  --focus-ring-offset
glass      --glass-overlay  --glass-overlay-strong  --glass-scrim  --glass-blur
depth      --shadow-xs|sm|md|lg|xl  --shadow-sheet  --glow-sm|md|lg
space      --space-0|1|2|3|4|5|6|7|8|10|12|16|20|24     (a 4px grid)
radius     --radius-xs|sm|md|lg|xl|2xl|3xl|full
type       --size-micro|xs|sm|base|md|lg|xl|2xl|3xl|4xl|5xl  --size-reading
           --size-fluid-display  --size-fluid-heading
           --font-display  --font-body  --font-mono  --weight-*  --leading-*
           --tracking-*  --tracking-display
motion     --duration-instant|fast|base|slow|slower|slowest|reveal
           --ease-standard|emphasized|decelerate|accelerate|reveal|expo
gradients  --gradient-<name>   (use .ah-surface--<name>, which brings its ink)
```

Three that catch people out:

- **`--text-muted` is a NON-TEXT token.** ~3:1. Status dots, rules, disabled
  marks. Never type — use `--text-secondary`.
- **`--border-control`, not `--border-strong`,** for a control's edge.
  `--border-strong` is a decorative separator and does not clear 3:1.
- **`--size-reading` (1rem), not `--size-base`,** for running prose.
  `--size-base` is a UI label size.

`tokens.json` has all of it in W3C DTCG format, both aesthetics.

## Classes

```
actions    .ah-btn [--sm --ghost --glass --danger --wide]
           .ah-pill [--outline --glass --static]  .ah-pill__dot
           .ah-link [--quiet]  .ah-actions [--stack]  .ah-hit
forms      .ah-field [--essence]  .ah-field__label  .ah-field__help
           .ah-chip  .ah-chip__dot
surfaces   .ah-card [--list --sunk --glass --gradient --flat --p0]
           .ah-scrim  .ah-sheet  .ah-sheet__grab  .ah-sheet__head
           .ah-sheet__title  .ah-sheet__close
display    .ah-caps [--micro --rule]  .ah-quote [--md --xl --bordered]
           .ah-mono [--sunk --glass --s20 --s44 --s84 --s110 --s144]
           .ah-dots  .ah-sdot  .ah-rule-row
feedback   .ah-toast  .ah-notice [--warning]  .ah-notice__title
           .ah-notice__row
type       .ah-display-xl|l|m  .ah-heading-l|m  .ah-title-l|m  .ah-body
           .ah-body-serif  .ah-prose  .ah-caption  .ah-pull-quote  .ah-label
           .ah-small-caps  .ah-micro-caps  .ah-display-fluid
layout     .ah-page  .ah-measure  .ah-stack  .ah-section
           .ah-app  .ah-screen  .ah-scroll  .ah-hdr  .ah-footer  .ah-list
           .ah-hrow
surface    .ah-surface--<gradient>
ambient    .ah-ambient [--void --bloom --grain --scan --vignette --grid
                        --isolines --horizon]      (Night only, decorative)
state      .is-active  .is-selected  .is-disabled  .is-tappable  .is-on
```

Variants are `--modifier`; state is `.is-*`. **Anything not on this list does
not exist.** Do not invent `.ah-alert` or `.ah-badge` — those are the two the
system specifically refuses.

## Hard constraints

1. **Emit nothing that appears on its own.** No `alert()`/`confirm()`, no
   modal on load, no banner, no cookie notice, no rating prompt, no push, no
   `role="alert"`, no `aria-live="assertive"`, no `setInterval`, no autoplay,
   no `beforeunload`, no `autofocus`. A toast is only ever the acknowledgement
   of an action the person just took.
2. **Never emit red.** There is no red token. If you are reaching for one, the
   thing you are building is probably refused for a second reason too.
3. **Every destructive or leaving action gets an equal-weight escape** —
   `.ah-btn` beside `.ah-btn.ah-btn--ghost`, labelled warmly ("Keep it", "Not
   now"), never grey text and never confirmshaming.
4. **Every interactive element is a real element** with an accessible name,
   reachable by keyboard, at a 44px target (`.ah-hit` if the painted control
   is smaller), acting on pointer-up so a mis-touch can be aborted.
5. **No interaction requires a drag, a hover, or a path gesture.**
6. **One gradient per screen**, via `.ah-surface--<name>`.
7. **No numbers as pressure** — no streaks, no scores, no countdowns, no
   "only N left".
8. **No emoji and no icon set.** A few restrained unicode glyphs (`←`, `×`,
   `+`, `·`) are acceptable, set in the type and never coloured.
9. **Never claim what you cannot verify.** "Ready for your calendar", not
   "Added".
10. **Never fail silently.** Say what happened, and say what is still true.

## Voice

Sentence case. Short declarative sentences. No exclamation marks, no ALL-CAPS,
no emoji.

```
Continue / Not now                    not   CONTINUE / cancel
Keep it / Delete it                   not   Are you sure?
3 remaining                           not   Only 3 left!
A quiet place to begin.               not   Get started now — don't miss out!
Ready for your calendar               not   Added!
That did not go through. Nothing
  was changed.                        not   Error: INVALID_INPUT.
```

## If a requirement conflicts with one of these

Say so rather than resolving it quietly. The conflict is usually the most
useful thing you have found.

Full documentation: <https://ahimsa-design.riverma.com>
