/* Components and Patterns pages. */
import { page, section, p, snippet, spec, esc } from './docs-lib.mjs';

const btnDemo = `
          <button class="ah-btn" type="button">Continue</button>
          <button class="ah-btn ah-btn--ghost" type="button">Not now</button>
          <button class="ah-btn ah-btn--sm ah-hit" type="button">Small</button>
          <button class="ah-btn ah-btn--danger" type="button">Remove it</button>
          <button class="ah-btn" type="button" disabled>Disabled</button>`;

export const components = page({
  file: 'components.html',
  title: 'Components',
  lede: 'Ten primitives, as framework-free CSS classes with the markup to paste.',
  body: `
    <section class="hero">
      <p class="ah-caps ah-caps--rule" style="margin:0">Components</p>
      <h1 class="ah-display-l heading-ink" style="margin:0">Ten primitives, and the markup to paste</h1>
      <p class="ah-prose hero__lede" style="margin:0">
        Plain CSS classes. No framework, no runtime, no build step — they drop
        into Svelte, React, a static page, or anything else that emits HTML.
        Every snippet below is complete and correct, including its ARIA.
      </p>
    </section>

${section('button', 'Actions', 'Button',
  p(`A quiet CTA in wide-tracked uppercase small caps. Press shrinks by 3% and
     never bounces. The feedback is <code>:active</code> rather than a pointerdown
     handler, so sliding your finger off still cancels the action — which matters
     to anyone whose aim is not precise.`),
  spec({
    label: 'Variants',
    demo: btnDemo,
    code: `<button class="ah-btn" type="button">Continue</button>
<button class="ah-btn ah-btn--ghost" type="button">Not now</button>
<button class="ah-btn ah-btn--sm ah-hit" type="button">Small</button>
<button class="ah-btn ah-btn--danger" type="button">Remove it</button>`,
    note: `<code>--ghost</code> is an <em>outlined</em> pill, not grey text. Grey text beside a filled pill reads as a caption, and a caption is not a choice. <code>--danger</code> is warm earth, never red: removing something is not an emergency.`,
  }),
  spec({
    label: 'On a gradient',
    demo: `<div class="ah-surface--dawn" style="padding:var(--space-6);border-radius:var(--radius-lg);display:flex;gap:var(--space-3);flex-wrap:wrap">
            <button class="ah-btn ah-btn--glass" type="button">Glass</button>
            <button class="ah-btn ah-btn--ghost" type="button">Not now</button>
          </div>`,
    code: `<div class="ah-surface--dawn">
  <button class="ah-btn ah-btn--glass" type="button">Glass</button>
</div>`,
    note: `Glass needs something behind it. On flat cream it reads as nothing — keep it for surfaces sitting on a gradient.`,
  }))}

${section('pill', 'Actions', 'Pill',
  p(`The workhorse: tags, switchers, filters, quiet actions. Always wrap small
     pills in <code>.ah-hit</code> — the painted control is under the 44px target
     floor, and that class grows what the finger hits without moving a pixel of
     what the eye sees.`),
  spec({
    label: 'Variants and states',
    demo: `
          <button class="ah-pill ah-hit" type="button">Default</button>
          <button class="ah-pill is-active ah-hit" type="button">Active</button>
          <button class="ah-pill ah-pill--outline ah-hit" type="button">Outline</button>
          <button class="ah-pill ah-pill--outline is-active ah-hit" type="button">Outline active</button>
          <span class="ah-pill ah-pill--static"><span class="ah-pill__dot"></span>With a dot</span>`,
    code: `<button class="ah-pill ah-hit" type="button">Default</button>
<button class="ah-pill is-active ah-hit" type="button" aria-pressed="true">Active</button>
<span class="ah-pill ah-pill--static">
  <span class="ah-pill__dot"></span>With a dot
</span>`,
    note: `The dot is never the only carrier of its meaning — the pill's own text says the same thing, because colour is not a channel everyone has.`,
  }))}

${section('link', 'Actions', 'Link',
  p(`The rule under a link draws itself in rather than the text changing colour
     and jumping. Taken from the reference this aesthetic was tuned against, and
     it fills a gap: the system previously had no link treatment at all.`),
  spec({
    label: 'Two registers',
    demo: `<p class="ah-prose" style="margin:0">A <a class="ah-link" href="#link">standing link</a> keeps a faint rule at rest. A <a class="ah-link ah-link--quiet" href="#link">quiet link</a> draws its rule only when you reach for it — for running prose, where a permanent underline on every reference would be noise.</p>`,
    code: `<a class="ah-link" href="/somewhere">A standing link</a>
<a class="ah-link ah-link--quiet" href="/somewhere">A quiet link</a>`,
  }))}

${section('field', 'Forms', 'Field',
  p(`No box. A single bottom rule that strengthens on focus does the whole job:
     a full border around a text field is a container, and a container implies
     something being collected.`),
  spec({
    label: 'Utility and essence',
    demo: `<div style="display:grid;gap:var(--space-6);width:100%;max-width:34rem">
            <label class="ah-field">
              <span class="ah-field__label">Their name</span>
              <input type="text" placeholder="Someone you are thinking of">
            </label>
            <label class="ah-field ah-field--essence">
              <span class="ah-field__label">What is alive in you</span>
              <textarea rows="2" placeholder="Say it however it comes"></textarea>
            </label>
          </div>`,
    code: `<label class="ah-field">
  <span class="ah-field__label">Their name</span>
  <input type="text" placeholder="Someone you are thinking of">
</label>

<label class="ah-field ah-field--essence">
  <span class="ah-field__label">What is alive in you</span>
  <textarea rows="2" placeholder="Say it however it comes"></textarea>
</label>`,
    note: `Inputs are 1rem, not the 0.8125rem the rest of the UI uses. Safari on iOS zooms the viewport when a field under 16px takes focus, and a zoomed fixed-position app cannot be scrolled — which reads as the app breaking the moment you try to type.`,
  }))}

${section('chip', 'Forms', 'ToggleChip',
  p(`Multi-select in the emotional voice. Nothing is pre-selected and nothing is
     required.`),
  spec({
    label: 'Selected and not',
    demo: `
          <button class="ah-chip" type="button" role="checkbox" aria-checked="false">seen</button>
          <button class="ah-chip is-selected" type="button" role="checkbox" aria-checked="true">held</button>
          <button class="ah-chip" type="button" role="checkbox" aria-checked="false">at ease</button>
          <button class="ah-chip" type="button" role="checkbox" aria-checked="false">tender</button>`,
    code: `<button class="ah-chip" type="button" role="checkbox" aria-checked="false">seen</button>
<button class="ah-chip is-selected" type="button" role="checkbox" aria-checked="true">held</button>`,
  }))}

${section('card', 'Surfaces', 'Card',
  p(`Three surface levels plus one glass level, expressed as background first and
     shadow second. A sunk surface gets no shadow at all — the colour <em>is</em>
     the elevation.`),
  spec({
    label: 'Variants',
    demo: `<div style="display:grid;gap:var(--space-4);grid-template-columns:repeat(auto-fit,minmax(200px,1fr));width:100%">
            <div class="ah-card"><p class="ah-caps" style="margin:0 0 6px">elevated</p><p class="ah-body" style="margin:0">The default. Warm paper shadow with an inner highlight.</p></div>
            <div class="ah-card ah-card--list"><p class="ah-caps" style="margin:0 0 6px">list</p><p class="ah-body" style="margin:0">A lighter shadow, for rows that repeat.</p></div>
            <div class="ah-card ah-card--sunk"><p class="ah-caps" style="margin:0 0 6px">sunk</p><p class="ah-body" style="margin:0">Recessed. No shadow at all.</p></div>
            <div class="ah-card ah-surface--cream"><p class="ah-caps" style="margin:0 0 6px">gradient</p><p class="ah-body" style="margin:0">One featured moment per screen.</p></div>
          </div>`,
    code: `<div class="ah-card">…</div>
<div class="ah-card ah-card--list">…</div>
<div class="ah-card ah-card--sunk">…</div>

<!-- a gradient card carries its own measured ink -->
<div class="ah-card ah-surface--cream">…</div>`,
    note: `No coloured-left-border cards and no hard outlines. Two gradient cards side by side is the rule this system breaks least gladly.`,
  }))}

${section('sheet', 'Surfaces', 'Sheet',
  p(`The bottom sheet, and the only modal this system has. <strong>Three ways out,
     always</strong>: the scrim, the grab handle, and a visible Close at equal
     weight. Never a trap. Putting the Close in the shared chrome is what makes
     omitting it structurally impossible rather than something to remember.`),
  spec({
    label: 'Structure',
    demo: `<div style="width:100%;max-width:26rem;border-radius:var(--radius-2xl);overflow:hidden;box-shadow:var(--shadow-lg)">
            <div class="ah-sheet" style="animation:none;position:relative">
              <div class="ah-sheet__grab"></div>
              <div class="ah-sheet__head">
                <h3 class="ah-sheet__title">Share this card</h3>
                <button class="ah-sheet__close" type="button" aria-label="Close">×</button>
              </div>
              <p class="ah-body secondary" style="margin:0 0 var(--space-5)">It leaves this device only when you send it.</p>
              <div class="ah-actions">
                <button class="ah-btn" type="button">Save a file</button>
                <button class="ah-btn ah-btn--ghost" type="button">Not now</button>
              </div>
            </div>
          </div>`,
    code: `<div class="ah-scrim" role="presentation">
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-labelledby="t">
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h2 class="ah-sheet__title" id="t">Share this card</h2>
      <button class="ah-sheet__close" type="button" aria-label="Close">×</button>
    </div>
    …
  </div>
</div>`,
    note: `Wire <kbd>Escape</kbd> to close as well. A sheet you can only leave by dragging is not leaveable by everyone.`,
  }))}

${section('display', 'Display', 'Small caps, pull quote, monogram, dots',
  p(`This system is deliberately icon-light, and its most distinctive "icon" is
     the absence of one: <strong>there is no notification badge component, by
     design</strong>. Updates surface through the rhythm of use, never a red dot.`),
  spec({
    label: 'SmallCapsLabel',
    demo: `<div style="display:grid;gap:var(--space-3)">
            <span class="ah-caps">Last together</span>
            <span class="ah-caps ah-caps--rule">With a rule</span>
            <span class="ah-caps ah-caps--micro">Micro, for the quietest metadata</span>
          </div>`,
    code: `<span class="ah-caps">Last together</span>
<span class="ah-caps ah-caps--rule">With a rule</span>
<span class="ah-caps ah-caps--micro">Quietest metadata</span>`,
  }),
  spec({
    label: 'PullQuote',
    demo: `<div style="display:grid;gap:var(--space-6);width:100%">
            <p class="ah-quote" style="margin:0">Nothing here is designed to grab you.</p>
            <p class="ah-quote ah-quote--bordered" style="margin:0">In NVC, every no is a yes to something else.</p>
          </div>`,
    code: `<p class="ah-quote">Nothing here is designed to grab you.</p>
<p class="ah-quote ah-quote--bordered">Every no is a yes to something else.</p>`,
    note: `<strong>Never quotation marks.</strong> The setting is already the quotation; the marks would only shout.`,
  }),
  spec({
    label: 'Monogram — an initial, never a photograph',
    demo: `
          <span class="ah-mono ah-mono--s44">A</span>
          <span class="ah-mono">R</span>
          <span class="ah-mono ah-mono--s84 ah-mono--sunk">M</span>
          <span class="ah-mono ah-mono--s84 ah-mono--glass" style="background-image:var(--gradient-dawn)">J</span>`,
    code: `<span class="ah-mono" aria-hidden="true">R</span>
<span class="ah-mono ah-mono--s84 ah-mono--sunk" aria-hidden="true">M</span>`,
    note: `Mark it <code>aria-hidden</code> when the person's name is already beside it — otherwise a screen reader reads the initial twice.`,
  }),
  spec({
    label: 'ProgressDots — where you are, with no count',
    demo: `<div class="ah-dots">
            <button type="button" class="is-on" aria-label="Page 1 of 4" aria-current="true"></button>
            <button type="button" aria-label="Page 2 of 4"></button>
            <button type="button" aria-label="Page 3 of 4"></button>
            <button type="button" aria-label="Page 4 of 4"></button>
          </div>`,
    code: `<div class="ah-dots">
  <button type="button" class="is-on" aria-label="Page 1 of 4" aria-current="true"></button>
  <button type="button" aria-label="Page 2 of 4"></button>
</div>`,
    note: `Each dot is a real button. Pagination you can only reach by dragging is not reachable at all for some people (WCAG 2.5.7), and the 44px target is added invisibly.`,
  }),
  spec({
    label: 'SectionRule',
    demo: `<p class="ah-rule-row ah-caps" style="margin:0;width:100%">This week</p>`,
    code: `<p class="ah-rule-row ah-caps">This week</p>`,
  }))}

${section('feedback', 'Feedback', 'Toast and Notice',
  p(`This is where the attention principle is load-bearing. <strong>Nothing in an
     Ahimsa interface appears on its own.</strong> The test is not "is it
     dismissible" but <em>did the person cause this, here, now?</em>`),
  spec({
    label: 'Toast — the acknowledgement of an action just taken',
    demo: `<div style="position:relative;width:100%;height:100px;background:var(--surface-sunk);border-radius:var(--radius-lg);overflow:hidden">
            <div class="ah-toast" style="bottom:var(--space-4)"><div class="ah-caption">Saved to this device. You can undo this.</div></div>
          </div>`,
    code: `<div class="ah-toast" role="status" aria-live="polite">
  <div class="ah-caption">Saved to this device. You can undo this.</div>
</div>`,
    note: `Always <code>role="status"</code> with <code>aria-live="polite"</code>. <strong>Never <code>role="alert"</code> or <code>aria-live="assertive"</code></strong>: an assertive region interrupts a screen-reader user mid-sentence, which is the same harm in a different channel.`,
  }),
  spec({
    label: 'Notice — what replaces every banner this system refuses',
    demo: `<div style="display:grid;gap:var(--space-4);width:100%">
            <div class="ah-notice">
              <p class="ah-notice__title" style="margin:0">Version</p>
              <div class="ah-notice__row">
                <p class="ah-body" style="margin:0">You are running 1.4.0.</p>
                <button class="ah-btn ah-btn--sm ah-btn--ghost ah-hit" type="button">Check for a new one</button>
              </div>
            </div>
            <div class="ah-notice ah-notice--warning">
              <p class="ah-notice__title" style="margin:0">That did not go through</p>
              <p class="ah-body" style="margin:0">The file could not be read. Nothing was changed, and your cards are as they were.</p>
            </div>
          </div>`,
    code: `<div class="ah-notice">
  <p class="ah-notice__title">Version</p>
  <div class="ah-notice__row">
    <p class="ah-body">You are running 1.4.0.</p>
    <button class="ah-btn ah-btn--sm ah-btn--ghost ah-hit">Check for a new one</button>
  </div>
</div>`,
    note: `A notice sits <em>in</em> the document flow, where the person already is. It does not float, does not cover anything, and does not take focus. There is deliberately no UpdateBar, no InstallBar, no banner and no modal in this system.`,
  }))}
`,
});

export const patterns = page({
  file: 'patterns.html',
  title: 'Patterns',
  lede: 'Compositions: the shell, the equal-weight choice, the version check, error without alarm.',
  body: `
    <section class="hero">
      <p class="ah-caps ah-caps--rule" style="margin:0">Patterns</p>
      <h1 class="ah-display-l heading-ink" style="margin:0">Compositions, and the reasoning inside them</h1>
      <p class="ah-prose hero__lede" style="margin:0">
        A primitive tells you what a button looks like. A pattern tells you what
        to do when someone is about to lose something.
      </p>
    </section>

${section('choice', 'The core pattern', 'An equal-weight choice',
  p(`Wherever this system offers a way out, that way out is a real control with
     the same metrics as the way forward. This is the single most repeated
     decision in the whole system, and it is the one most often got wrong.`),
  `      <div class="pair">
        <div class="yes">
          <p class="ah-caps" style="margin:0">Do this</p>
          <div class="ah-actions"><button class="ah-btn" type="button">Delete it</button><button class="ah-btn ah-btn--ghost" type="button">Keep it</button></div>
          <p class="ah-body secondary" style="margin:0">An outlined pill beside a filled one. Both are buttons, both are the same size, and declining is a legitimate answer.</p>
        </div>
        <div class="no">
          <p class="ah-caps" style="margin:0">Not this</p>
          <div class="ah-actions"><button class="ah-btn" type="button">Delete it</button><span class="ah-body muted">no, I don't want to keep my data safe</span></div>
          <p class="ah-body secondary" style="margin:0">Grey text reads as a caption rather than a choice, and confirmshaming puts a cost on saying no. Both are refused.</p>
        </div>
      </div>`,
  snippet(`<div class="ah-actions">
  <button class="ah-btn" type="button">Delete it</button>
  <button class="ah-btn ah-btn--ghost" type="button">Keep it</button>
</div>`),
  p(`Label the escape hatch for what it <em>is</em>, not for what it is not:
     "Keep it", "Not now", "Leave it open", "Stay here". Never "Cancel" where a
     warmer word is true, and never a sentence engineered to make you feel small.`))}

${section('version', 'The pull model', 'Checking for a new version',
  p(`Most systems ship a bar that slides in to tell you an update is ready.
     Ahimsa does not, and this is the replacement. Version news is something you
     look up, never something you are told — whatever you were doing is what you
     should still be doing.`),
  `      <div class="pair">
        <div class="yes">
          <p class="ah-caps" style="margin:0">Do this — in Settings</p>
          <div class="ah-notice">
            <p class="ah-notice__title" style="margin:0">Version</p>
            <div class="ah-notice__row">
              <p class="ah-body" style="margin:0">You are running 1.4.0.</p>
              <button class="ah-btn ah-btn--sm ah-btn--ghost ah-hit" type="button">Check</button>
            </div>
          </div>
          <p class="ah-body secondary" style="margin:0">The person presses. The answer lands inline, beside the control that asked for it.</p>
        </div>
        <div class="no">
          <p class="ah-caps" style="margin:0">Not this</p>
          <div style="border-radius:var(--radius-lg);padding:var(--space-3) var(--space-4);background:var(--surface-sunk);display:flex;gap:var(--space-3);align-items:center;justify-content:space-between">
            <span class="ah-body">A newer version is ready.</span>
            <span class="ah-pill ah-pill--static">Update</span>
          </div>
          <p class="ah-body secondary" style="margin:0">A bar that slides in over your work. It is dismissible, and it is still an interruption: it arrived on its own schedule and spent your attention to do it.</p>
        </div>
      </div>`,
  p(`The same reasoning rules out modals on load, cookie banners, rating prompts,
     push notifications, <code>beforeunload</code> nags and autoplay.
     <code>tools/check-attention.mjs</code> fails the build on all of them.`))}

${section('error', 'When something breaks', 'Error without alarm',
  p(`There is no red in this system, and no error banner. If something did not
     work, the app says so in the same voice it says everything else — and it
     says what is still true, because the thing a person most needs to know is
     whether they have lost anything.`),
  `      <div class="pair">
        <div class="yes">
          <p class="ah-caps" style="margin:0">Do this</p>
          <div class="ah-notice ah-notice--warning">
            <p class="ah-notice__title" style="margin:0">That did not go through</p>
            <p class="ah-body" style="margin:0">The file could not be read. Nothing was changed, and your cards are as they were.</p>
          </div>
        </div>
        <div class="no">
          <p class="ah-caps" style="margin:0">Not this</p>
          <p class="ah-body" style="margin:0"><strong>Error: IMPORT_FAILED (0x2F)</strong> — invalid input. Please try again.</p>
          <p class="ah-body secondary" style="margin:0">A code, a scold, and no answer to the only question that matters. "Invalid input" also puts the fault on the person.</p>
        </div>
      </div>`,
  p(`And <strong>failures are never silent</strong>. A control that goes quiet and
     stays dead leaves someone tapping at a screen with no idea whether they did
     something wrong. Say what happened.`))}

${section('shell', 'Layout', 'Two shells, and picking the right one',
  p(`<code>.ah-page</code> is a normal document: fluid gutters, a reading measure,
     scrolling the way the browser intends. <code>.ah-app</code> is a fixed
     full-viewport application frame with safe-area insets, widening in steps so
     a desktop window gets a comfortable app rather than a narrow strip.`),
  p(`The trade is real: a fixed shell cannot reflow the way a document can, so do
     not reach for it to hold an article. This site uses <code>.ah-page</code>.`),
  snippet(`<!-- a document -->
<div class="ah-page">
  <article class="ah-measure ah-stack">…</article>
</div>

<!-- an installed app -->
<div class="ah-app">
  <section class="ah-screen">
    <header class="ah-hdr">…</header>
    <div class="ah-scroll">…</div>
    <footer class="ah-footer">…</footer>
  </section>
</div>`),
  p(`The app shell needs
     <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1,
     viewport-fit=cover"&gt;</code>. Note what is absent from that: no
     <code>maximum-scale</code>, no <code>user-scalable=no</code>. Pinch zoom
     always stays.`),
  `      <div class="ah-card ah-card--sunk">
        <p class="ah-caps" style="margin:0 0 var(--space-3)">Two details worth keeping</p>
        <p class="ah-body" style="margin:0 0 var(--space-3)"><strong>The scroll tail is a block, not padding.</strong> End padding on a flex scroll container is not reliably part of what the browser will scroll to. A block is content, and every engine scrolls to the end of its content.</p>
        <p class="ah-body" style="margin:0"><strong><code>overscroll-behavior-y</code>, not both axes.</strong> Setting it on x swallows horizontal trackpad swipes, which can turn a pager into a one-way trap with no pointer route back.</p>
      </div>`)}

${section('gradient', 'Surfaces', 'Putting text on a gradient',
  p(`Use <code>.ah-surface--&lt;name&gt;</code> rather than setting a gradient by
     hand. The class carries the gradient <em>and</em> the ink measured against
     its worst stop, so anything inside reads correctly without you checking.`),
  `      <div class="pair">
        <div class="ah-surface--bodhi" style="padding:var(--space-6);border-radius:var(--radius-lg)">
          <p class="ah-caps" style="margin:0 0 var(--space-2)">carries text</p>
          <p class="ah-heading-m" style="margin:0 0 var(--space-2)">The surface brings its own ink.</p>
          <p class="ah-body" style="margin:0">Heading, body and muted are all measured against this ramp's darkest stop.</p>
        </div>
        <div style="background:var(--gradient-indigo);padding:var(--space-6);border-radius:var(--radius-lg)">
          <div class="ah-card">
            <p class="ah-caps" style="margin:0 0 var(--space-2)">surface only</p>
            <p class="ah-body" style="margin:0">Five of Day's gradients span too wide a lightness range for any ink to clear AA across them. They are backdrops — text on them goes in an opaque card, exactly like this one.</p>
          </div>
        </div>
      </div>`)}
`,
});
