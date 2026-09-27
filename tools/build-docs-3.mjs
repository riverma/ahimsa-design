/* Principles, Accessibility, For-agents pages. */
import { page, section, p, snippet, esc, VERSION } from './docs-lib.mjs';
import { readFileSync } from 'node:fs';

const DEV = /const DEVIATIONS = \{([\s\S]*?)\n\};/.exec(readFileSync('tools/check-parity.mjs', 'utf8'));
const deviations = [...(DEV ? DEV[1] : '').matchAll(/'(--[a-z-]+)':\s*'([^']*)'/g)].map((m) => [m[1], m[2]]);

const MOVES_DAY = [
  ['Cream, never white. Warm brown ink, never black.', 'Pure black on pure white is harsher than any screen needs, and it reads as clinical.'],
  ['Two voices in type.', 'An italic serif for what is felt, wide-tracked small caps for what is known. The split is the tone.'],
  ['Rounded at every scale. A bottom rule, not a box.', 'Sharp corners carry an implicit threat; a box around a field implies something being collected.'],
  ['One gradient owns a screen, with frosted glass on top.', 'Emphasis is a moment, not a texture. Two gradients side by side is the rule this system breaks least gladly.'],
  ['Motion that settles.', 'Every easing ends at 1.0 with nothing above it, so no transition can bounce. Settling, not pouncing.'],
];
const MOVES_NIGHT = [
  ['Deep blue-black, never pure black. Ice, never pure white.', 'The same colour law as Day, held from the other end.'],
  ['Ultralight sans for what is felt, mono for what is measured.', 'Night has no serif. The emotional register is weight and space instead.'],
  ['Structure by hairline and glow, not shadow.', 'A drop shadow is invisible on a dark ground. An inset ring draws the edge; light does the lifting.'],
  ['One field owns a screen, and it is ambient — never information.', 'The decorative layer has no state and nothing that can be missed by ignoring it.'],
  ['Light that breathes slower than you.', 'Nothing pulses faster than 0.1Hz, and nothing animates position.'],
];

const REFUSALS = [
  ['No red, and no danger token.', 'Neither aesthetic contains one. Errors are warm clay or warm copper, because a person who hit a problem has not done something wrong.'],
  ['No notification badge component.', 'Not a styling choice — the component does not exist. Updates surface through the rhythm of use.'],
  ['Nothing appears unasked.', 'No banners, no modals on load, no floating update bars, no consent interstitials, no push, no autoplay, no beforeunload nag, no hover-delay tooltip that covers content.'],
  ['No aria-live="assertive", no role="alert".', 'An assertive region interrupts a screen-reader user mid-sentence. Same harm, different channel.'],
  ['No streaks that punish.', 'Nothing that turns an absence into a failure, and no gap where something used to be that reads as a telling-off.'],
  ['No numbers used as pressure.', 'Counts are stated neutrally — "3 remaining", never "only 3 left". Stats are reflective, never a scoreboard.'],
  ['No metric between two people.', 'No score on a relationship, no rank, no tier. A scale invites you to fail at something that is not a test.'],
  ['No manufactured scarcity or urgency.', 'No countdowns, no timeouts, no "act now". There is no timing dependency anywhere in the system.'],
  ['No confirmshaming.', 'Escape hatches get neutral, equal-weight labels. Never "No, I don\'t want to improve".'],
  ['No hidden opt-outs.', 'If it can be turned on, it can be turned off, in the same number of steps and in the place you would look.'],
  ['No endless scroll, no feed.', 'A list that flies past under your thumb is a feed, and a feed is the interaction pattern this system exists not to be.'],
  ['No traffic-light mapping.', 'Never red / amber / green for how something is going. Hue may band by warmth; it may not grade you.'],
  ['No claiming what cannot be verified.', 'The button says "Add to calendar" and the confirmation says "Ready for your calendar" — never "Added".'],
  ['No silent failure.', 'A control that goes quiet and stays dead leaves someone tapping at a screen wondering what they did wrong.'],
  ['No emoji, no icon set.', 'Type and space carry the meaning. A few restrained unicode glyphs are acceptable as quiet affordances.'],
  ['No dead ends.', 'Every sheet has three ways out. Every link that might not resolve degrades to something that does.'],
];

const WCAG = [
  ['1.4.1', 'Use of colour', 'Met', 'Every status has a text or shape channel. The pill dot never carries meaning alone.'],
  ['1.4.3', 'Contrast (minimum)', 'Met', 'Machine-checked across both aesthetics and all 28 gradients by tools/check-contrast.mjs. Three inherited token values were raised to reach it — see below.'],
  ['1.4.4', 'Resize text', 'Met', 'The whole type scale is rem. Nothing sets a px font-size on the root.'],
  ['1.4.10', 'Reflow', 'Met for .ah-page', 'The document shell reflows to 320px. The fixed app shell is a deliberate trade — do not use it to hold an article.'],
  ['1.4.11', 'Non-text contrast', 'Met', '--border-control (a control\'s edge) clears 3:1. --border-strong is a separator and deliberately does not — it carries no information.'],
  ['1.4.12', 'Text spacing', 'Met', 'No fixed line heights that clip, no max-height on text containers.'],
  ['1.4.13', 'Content on hover or focus', 'Met', 'No hover-revealed content anywhere. The system has no tooltips.'],
  ['2.1.1', 'Keyboard', 'Met', 'Every control is a real button or input. No div handlers.'],
  ['2.1.2', 'No keyboard trap', 'Met', 'Escape closes the only modal the system has.'],
  ['2.2.1', 'Timing adjustable', 'Met', 'There is no timing. No timeouts, no auto-advance, no session expiry.'],
  ['2.3.1', 'Three flashes', 'Met', 'The ambient layer cannot animate faster than 0.1Hz; check-attention.mjs enforces a 2s floor.'],
  ['2.3.3', 'Animation from interactions', 'Met', 'prefers-reduced-motion removes animation outright, without lowering durations.'],
  ['2.4.7', 'Focus visible', 'Met', 'A :focus-visible ring on every focusable element. The blanket outline:none this was extracted from is gone.'],
  ['2.4.11', 'Focus not obscured', 'Met', 'Nothing in the system is position:fixed over content. The site header is in the flow.'],
  ['2.5.1', 'Pointer gestures', 'Met', 'No path-based or multipoint gesture is required anywhere.'],
  ['2.5.2', 'Pointer cancellation', 'Met', 'Press feedback is :active and actions fire on up, so sliding off aborts.'],
  ['2.5.5', 'Target size (AAA)', 'Met', '.ah-hit gives a 44px target without moving a painted pixel.'],
  ['2.5.7', 'Dragging movements', 'Met', 'Pagination dots are buttons. Any drag affordance must be paired with a single-pointer route.'],
  ['4.1.2', 'Name, role, value', 'Met', 'Every snippet on the Components page ships its ARIA.'],
  ['1.4.3 (hints)', '--text-faint', 'Partial, by declaration', 'At 2.07:1 it does not meet AA and is not intended to: it is for hints, no component uses it, and it must never be the sole carrier of meaning.'],
];

export const principles = page({
  file: 'principles.html',
  title: 'Principles',
  lede: 'The premise, the voice, the five moves, and the full list of refusals.',
  body: `
    <section class="hero">
      <p class="ah-caps ah-caps--rule" style="margin:0">Principles</p>
      <h1 class="ah-display-l heading-ink" style="margin:0">What this system is for, and what it will not do</h1>
      <p class="ah-prose hero__lede" style="margin:0">
        The refusals are as much a part of Ahimsa as the colour tokens. Adopting
        the look without them produces something that is merely warm, which is
        worse than neither — warmth is not camouflage.
      </p>
    </section>

${section('premise', 'The premise', 'Non-harm, applied to interface design',
  `      <blockquote class="ah-quote ah-quote--xl ah-quote--bordered ah-measure" style="margin:0 0 var(--space-6)">
        If a design pattern requires the user to lose for the product to win,
        this system will not produce it.
      </blockquote>`,
  p(`<strong>Ahimsa</strong> (Sanskrit अहिंसा, <em>ahiṃsā</em>) is the ethical
     principle of causing no harm, in thought, word and action. It runs through
     Gandhi, through King, and through the Buddha's teaching on compassion.
     Applied to design it means refusing the whole vocabulary of extractive UX.`),
  p(`This is a narrow system on purpose. It belongs to software whose success
     genuinely correlates with the wellbeing of the person using it. If your
     product's metrics improve when someone's attention is captured, this is the
     wrong system and the mismatch will show.`))}

${section('attention', 'Attention', 'A strict pull model',
  p(`<strong>Nothing in an Ahimsa interface appears on its own.</strong> Whatever
     someone was doing is what they stay doing. Information waits somewhere
     findable until they come looking for it.`),
  p(`The test is not "is it dismissible" but: <strong>did the person cause this,
     here, now?</strong>`),
  `      <div class="pair" style="margin-bottom:var(--space-6)">
        <div class="yes">
          <p class="ah-caps" style="margin:0">A response — allowed</p>
          <p class="ah-body" style="margin:0">It appears because the person just acted, in the place they were already looking, without taking focus and without covering their work. A confirmation toast after a save. An inline coaching chip that appears under the text as a consequence of typing.</p>
        </div>
        <div class="no">
          <p class="ah-caps" style="margin:0">An interruption — refused</p>
          <p class="ah-body" style="margin:0">It arrives on its own schedule, or takes focus, or covers the work. A floating update bar is refused even though it is dismissible, because being dismissible is not the test.</p>
        </div>
      </div>`,
  p(`This is strict enough to rule out a component this system's own reference
     apps ship. The right conclusion is one step past "make the bar dismissible":
     don't announce the update at all. Put it in Settings, behind a control the
     person presses. See
     <a class="ah-link" href="patterns.html#version">the version-check pattern</a>.`))}

${section('voice', 'Voice', 'How Ahimsa writes',
  p(`The voice is as much a part of the system as the colour tokens, and it is
     the part most often dropped in adoption.`),
  `      <ul class="ah-prose ah-measure" style="margin:0 0 var(--space-6);padding-left:1.2em;display:grid;gap:var(--space-3)">
        <li><strong>Warm, plain, unhurried.</strong> Short declarative sentences. No exclamation marks, no ALL-CAPS urgency, no growth-hacky punch. "A quiet place to begin." not "Get started now — don't miss out!"</li>
        <li><strong>Second person, gently.</strong> Invites rather than instructs: "Would you like to continue?" not "CONTINUE→".</li>
        <li><strong>Declining is a legitimate answer.</strong> "Later", "Not now", "Leave it open", "Keep it" — never a label engineered to make saying no feel like a failure.</li>
        <li><strong>Emotional lines are set apart; factual lines stay plain.</strong> A reflective sentence takes the emotional register; a date or a count is upright small caps. The split is the tone.</li>
        <li><strong>No numbers as pressure.</strong> "3 remaining", never "ONLY 3 LEFT!"</li>
        <li><strong>Lowercase, mostly.</strong> Sentence case in body and display. Small caps are the only uppercase, and they read like magazine captions.</li>
        <li><strong>No emoji.</strong> The warmth comes from typography and space.</li>
        <li><strong>Never quotation marks on a pull quote.</strong> The setting is already the quotation.</li>
      </ul>`,
  `      <p class="ah-quote ah-measure" style="margin:0">Nothing here is designed to grab you. · A supporting line, quietly offered. · Continue / Not now</p>`)}

${section('moves', 'The fingerprint', 'The five moves',
  p(`Preserve these and the system stays recognisable; drop one and it stops
     being Ahimsa. <em>A note on provenance: the original card naming these was
     lost. What follows is reconstructed from the shipped system, and is
     labelled as a reconstruction rather than presented as recovered.</em>`),
  `      <div class="pair">
        <div class="ah-card">
          <p class="ah-caps ah-caps--rule" style="margin:0 0 var(--space-4)">Ahimsa Day</p>
          <ol class="ah-body" style="margin:0;padding-left:1.3em;display:grid;gap:var(--space-3)">
${MOVES_DAY.map(([t, w]) => `            <li><strong>${esc(t)}</strong><br><span class="secondary">${esc(w)}</span></li>`).join('\n')}
          </ol>
        </div>
        <div class="ah-card">
          <p class="ah-caps ah-caps--rule" style="margin:0 0 var(--space-4)">Ahimsa Night</p>
          <ol class="ah-body" style="margin:0;padding-left:1.3em;display:grid;gap:var(--space-3)">
${MOVES_NIGHT.map(([t, w]) => `            <li><strong>${esc(t)}</strong><br><span class="secondary">${esc(w)}</span></li>`).join('\n')}
          </ol>
        </div>
      </div>`)}

${section('refusals', 'The ethical fingerprint', 'Refusals',
  p(`The list below is normative. An interface built on Ahimsa tokens that does
     any of these is not using the system, whatever it looks like.`),
  `      <table class="tbl tbl--fixed" style="margin-bottom:var(--space-6)">
        <thead><tr><th style="width:38%">Refused</th><th>Why</th></tr></thead>
        <tbody>
${REFUSALS.map(([t, w]) => `          <tr><td><strong>${esc(t)}</strong></td><td class="secondary">${esc(w)}</td></tr>`).join('\n')}
        </tbody>
      </table>`,
  `      <div class="ah-card ah-card--sunk">
        <p class="ah-caps" style="margin:0 0 var(--space-3)">The audit, before you ship</p>
        <ol class="ah-body" style="margin:0;padding-left:1.3em;display:grid;gap:var(--space-2)">
          <li>Does anything appear that the person did not cause? Run <code>tools/check-attention.mjs</code> and then look with your own eyes.</li>
          <li>Is every escape hatch a real control at equal metrics, labelled for what it is?</li>
          <li>Is any number on screen capable of reading as a score, a streak, or a shortfall?</li>
          <li>Does any colour carry meaning that no word or shape also carries?</li>
          <li>If a control fails, does the person find out — and are they told what is still true?</li>
          <li>Can every interaction be completed without a drag, a hover, or a gesture?</li>
          <li>Does anything claim an outcome the app cannot actually verify?</li>
          <li>Is there a way out of every surface, reachable by keyboard?</li>
        </ol>
      </div>`)}

${section('themes', 'A note on themes', 'Night is not a dark mode',
  p(`Day and Night are different characters, not different brightnesses. Night
     has its own type voice, its own approach to elevation, and its own ambient
     layer; it is a sibling aesthetic that happens to be dark.`),
  p(`So the system deliberately does not wire the theme to
     <code>prefers-color-scheme</code>. Flipping an interface's whole character
     because of an operating-system setting is exactly the kind of surprise this
     system refuses — and someone who set their OS to dark at night did not ask
     your app to become a different product. Let a person choose, and remember
     what they chose.`))}
`,
});

export const accessibility = page({
  file: 'accessibility.html',
  title: 'Accessibility',
  lede: 'WCAG 2.2 AA, checked by machine rather than claimed — including what is only partially met.',
  body: `
    <section class="hero">
      <p class="ah-caps ah-caps--rule" style="margin:0">Accessibility</p>
      <h1 class="ah-display-l heading-ink" style="margin:0">Inherited, not owed</h1>
      <p class="ah-prose hero__lede" style="margin:0">
        The position this system was extracted from was that it "is not
        accessible by default — the consumer has to check". That is no longer
        the position. Adopting Ahimsa should mean inheriting accessibility
        rather than acquiring a debt.
      </p>
    </section>

${section('conformance', 'Conformance', 'WCAG 2.2 AA, criterion by criterion',
  p(`Target is WCAG 2.2 Level AA, the standard the US Department of Justice's
     2024 ADA Title II rule adopts. Rows below marked <em>Met</em> are enforced
     by a gate in <code>tools/</code>, by construction, or both. Rows that are
     only partially met say so.`),
  `      <table class="tbl">
        <thead><tr><th>SC</th><th>Criterion</th><th>Status</th><th>How</th></tr></thead>
        <tbody>
${WCAG.map(([sc, name, status, how]) => `          <tr><td><code>${esc(sc)}</code></td><td>${esc(name)}</td><td>${status === 'Met' ? '<span class="ah-pill ah-pill--static"><span class="ah-pill__dot" style="background:var(--accent-success)"></span>Met</span>' : `<span class="ah-pill ah-pill--static"><span class="ah-pill__dot" style="background:var(--accent-warning)"></span>${esc(status)}</span>`}</td><td class="secondary">${esc(how)}</td></tr>`).join('\n')}
        </tbody>
      </table>`)}

${section('deviations', 'The cost', 'Three inherited values had to change',
  p(`Ahimsa Day is a restructure of a system already shipping in two apps, so the
     rule was that no colour value moves. Three had to. Each is declared in
     <code>tools/check-parity.mjs</code>, which fails the build if a declared
     deviation disappears <em>or</em> if any undeclared value moves.`),
  `      <table class="tbl tbl--fixed">
        <thead><tr><th style="width:26%">Token</th><th>Reason</th></tr></thead>
        <tbody>
${deviations.map(([t, why]) => `          <tr><td><code>${esc(t)}</code></td><td class="secondary">${esc(why)}</td></tr>`).join('\n')}
        </tbody>
      </table>`,
  p(`Two of the three are not invented values: a shipping consumer had already
     independently arrived at exactly them, for an unrelated reason. That is a
     reasonable sign they are right.`),
  p(`The type scale also moved from <code>px</code> to <code>rem</code> at
     identical computed sizes. Nothing renders differently at default settings,
     but a px scale silently overrides a person's own browser font size, which
     for this system is the wrong way round.`))}

${section('gaps', 'Honestly', 'What is still imperfect',
  `      <ul class="ah-prose ah-measure" style="margin:0;padding-left:1.2em;display:grid;gap:var(--space-3)">
        <li><strong>Five Day gradients cannot carry text.</strong> clay, indigo, monsoon, periwinkle and periwinkle-soft span too wide a lightness range for any ink to clear AA across them. They ship as surface-only, and text on them belongs in an opaque card. They were not narrowed because they are the system's signature ramps and two apps already render them.</li>
        <li><strong><code>--text-faint</code> is 2.07:1</strong> and does not meet AA. It is for hints, no component uses it, and the docs say plainly that it must never be the sole carrier of meaning. If you find yourself reaching for it to set real content, reach for <code>--text-muted</code> instead.</li>
        <li><strong>The fixed app shell does not reflow like a document.</strong> <code>.ah-app</code> meets 320px, but at 200% zoom a fixed-viewport application is inherently tighter than a flowing page. Use <code>.ah-page</code> for anything read rather than operated.</li>
        <li><strong>Night's hairline weights are capped at display sizes.</strong> Weight 200 loses effective contrast at small sizes because the stems thin out, so body copy in Night is 400 and never lighter. This is enforced by convention, not by a gate.</li>
        <li><strong>The two apps this was extracted from do not yet comply.</strong> Both ship a floating update bar that this system now refuses, and one has a drag-driven card deck with no single-pointer alternative. Those are theirs to fix, and naming them here is more useful than implying otherwise.</li>
      </ul>`)}

${section('running', 'Verifying', 'Run the gates yourself',
  snippet(`npm run check        # parity, contrast, attention, offline
npm run check:a11y   # axe-core through Playwright, both themes, 320/390/1280 + 200% zoom`),
  p(`The contrast gate composites translucent ink onto its actual ground before
     measuring, which most checkers do not — quiet text in this system is the
     ink colour at low alpha, and a ratio computed without compositing is
     meaningless.`))}
`,
});

export const agents = page({
  file: 'agents.html',
  title: 'For agents',
  lede: 'Machine-readable tokens, the class vocabulary, and the constraints that are not negotiable.',
  body: `
    <section class="hero">
      <p class="ah-caps ah-caps--rule" style="margin:0">For agents</p>
      <h1 class="ah-display-l heading-ink" style="margin:0">Building with Ahimsa, without a person in the loop</h1>
      <p class="ah-prose hero__lede" style="margin:0">
        This page is the short brief. If you are an agent generating an
        interface, you need three things: the token vocabulary, the class
        vocabulary, and the list of things you must not produce.
      </p>
    </section>

${section('start', 'Setup', 'What to load',
  snippet(`ahimsa-design/
  dist/ahimsa-day.css      one aesthetic, flattened, self-contained
  dist/ahimsa-night.css    the other
  dist/ahimsa.css          both, switch with a class on <html>
  dist/CHECKSUMS           sha256 per file, for a pinned vendored copy
  fonts/                   6 woff2 + 3 OFL licence texts — copy all of it
  tokens.json              every token, W3C DTCG format, both themes
  SKILL.md                 this brief, in full`),
  p(`Link one stylesheet, put <code>class="ahimsa-day"</code> or
     <code>class="ahimsa-night"</code> on <code>&lt;html&gt;</code>, and copy
     <code>fonts/</code> next to it. Never load a font or a script from a CDN.`))}

${section('tokens', 'Vocabulary', 'Reference semantics, never raw palette steps',
  p(`A component must never reach for <code>--saffron-600</code> or
     <code>--neutral-200</code> directly. Use the semantic layer, which both
     aesthetics define with identical names — that is the entire reason markup
     is theme-portable.`),
  snippet(`surfaces   --surface-canvas  --surface-elevated  --surface-sunk  --surface-inverse
text       --text-heading  --text-body  --text-secondary  --text-muted  --text-inverse
borders    --border-subtle  --border-medium  --border-strong  --border-control
accents    --accent-primary  --accent-secondary  --accent-success  --accent-warning
focus      --focus-ring  --focus-ring-width
glass      --glass-overlay  --glass-overlay-strong  --glass-scrim  --glass-blur
depth      --shadow-xs..xl  --shadow-sheet  --glow-sm  --glow-md  --glow-lg
space      --space-0..24          radius  --radius-xs..3xl  --radius-full
type       --size-micro..5xl  --size-reading  --font-display  --font-body  --font-mono
motion     --duration-*  --ease-*`),
  `      <div class="ah-card ah-card--sunk">
        <p class="ah-caps" style="margin:0 0 var(--space-3)">Three that will catch you out</p>
        <p class="ah-body" style="margin:0 0 var(--space-2)"><code>--border-control</code>, not <code>--border-strong</code>, for the edge of an interactive control. The former clears 3:1; the latter is a decorative separator and deliberately does not.</p>
        <p class="ah-body" style="margin:0 0 var(--space-2)"><code>--size-reading</code>, not <code>--size-base</code>, for running prose. <code>--size-base</code> is a UI label size.</p>
        <p class="ah-body" style="margin:0"><code>--glow-*</code> is <code>none</code> in Day. Reference it unconditionally; it does the right thing in both.</p>
      </div>`)}

${section('classes', 'Vocabulary', 'The class list, complete',
  snippet(`actions    .ah-btn [--sm --ghost --glass --danger --wide]  .ah-pill [--outline --glass --static]
           .ah-link [--quiet]  .ah-actions  .ah-hit
forms      .ah-field [--essence]  .ah-field__label  .ah-field__help  .ah-chip
surfaces   .ah-card [--list --sunk --glass --flat --p0]  .ah-scrim  .ah-sheet
           .ah-sheet__grab  .ah-sheet__head  .ah-sheet__title  .ah-sheet__close
display    .ah-caps [--micro --rule]  .ah-quote [--md --xl --bordered]
           .ah-mono [--sunk --glass --s20..s144]  .ah-dots  .ah-sdot  .ah-rule-row
feedback   .ah-toast  .ah-notice [--warning]  .ah-notice__title  .ah-notice__row
type       .ah-display-xl/l/m  .ah-heading-l/m  .ah-title-l/m  .ah-body  .ah-body-serif
           .ah-prose  .ah-caption  .ah-pull-quote  .ah-label  .ah-small-caps  .ah-micro-caps
           .ah-display-fluid
layout     .ah-page  .ah-measure  .ah-stack  .ah-section  .ah-app  .ah-screen  .ah-scroll
           .ah-hdr  .ah-footer  .ah-list  .ah-hrow
surface    .ah-surface--<gradient>     ambient  .ah-ambient--<void|bloom|grain|scan|vignette|grid|isolines|horizon>
state      .is-active  .is-selected  .is-disabled  .is-tappable  .is-on`),
  p(`State is <code>.is-*</code>; variants are <code>--modifier</code>. Anything
     not on this list does not exist — do not invent
     <code>.ah-alert</code> or <code>.ah-badge</code>, because those are the two
     the system specifically refuses.`))}

${section('rules', 'Constraints', 'Not negotiable',
  `      <ol class="ah-prose ah-measure" style="margin:0 0 var(--space-6);padding-left:1.3em;display:grid;gap:var(--space-3)">
        <li><strong>Emit nothing that appears on its own.</strong> No <code>alert()</code>, no modal on load, no banner, no toast that is not the direct consequence of an action the person just took, no <code>role="alert"</code>, no <code>aria-live="assertive"</code>, no <code>setInterval</code>, no autoplay, no <code>beforeunload</code>.</li>
        <li><strong>Never emit red.</strong> There is no red token. If you are reaching for one, the thing you are building is probably refused for a second reason too.</li>
        <li><strong>Every destructive or leaving action gets an equal-weight escape.</strong> <code>.ah-btn</code> beside <code>.ah-btn.ah-btn--ghost</code>, labelled warmly.</li>
        <li><strong>Every interactive element is a real element</strong> with an accessible name, reachable by keyboard, at a 44px target, acting on pointer-up.</li>
        <li><strong>Never disable pinch zoom.</strong> No <code>maximum-scale</code>, no <code>user-scalable=no</code>.</li>
        <li><strong>Never load anything over a network.</strong> No CDN, no Google Fonts, no remote <code>@import</code>.</li>
        <li><strong>One gradient per screen</strong>, via <code>.ah-surface--&lt;name&gt;</code> so the ink comes with it.</li>
        <li><strong>Run the gates.</strong> <code>npm run check</code> will fail on most violations of the above, which is the point of it existing.</li>
      </ol>`,
  p(`If a requirement you have been given conflicts with one of these, say so
     rather than resolving it quietly. The conflict is usually the most useful
     thing you have found.`))}

${section('voice-brief', 'Copy', 'Write it like this',
  snippet(`Continue / Not now              not  CONTINUE / cancel
Keep it / Delete it             not  Are you sure?
3 remaining                     not  Only 3 left!
A quiet place to begin.         not  Get started now — don't miss out!
Ready for your calendar         not  Added!
That did not go through. Nothing was changed.
                                not  Error: INVALID_INPUT. Please try again.`),
  p(`Sentence case. No exclamation marks, no ALL-CAPS, no emoji. Short
     declarative sentences. When something fails, say what is still true.`))}
`,
});
