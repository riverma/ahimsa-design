/* The documentation site's only script.
   Two jobs: remember which theme you chose, and copy a snippet when you
   ask for it. Nothing here runs on a timer, and nothing appears on its own. */

(function () {
  'use strict';

  var KEY = 'ahimsa-theme';
  var root = document.documentElement;

  function apply(theme) {
    root.classList.remove('ahimsa-day', 'ahimsa-night');
    root.classList.add('ahimsa-' + theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'night' ? '#0e131a' : '#ebe6df');
    }
    document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      var on = b.getAttribute('data-theme-btn') === theme;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* Deliberately NOT prefers-color-scheme. Day and Night are different
     characters, not different brightnesses, and swapping an interface's
     whole character because of an OS setting is the kind of surprise this
     system refuses. The stored choice is the person's own. */
  var stored;
  try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }
  apply(stored === 'night' ? 'night' : 'day');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-btn]');
    if (btn) {
      var t = btn.getAttribute('data-theme-btn');
      apply(t);
      try { localStorage.setItem(KEY, t); } catch (err) { /* private mode: fine */ }
      return;
    }

    var copy = e.target.closest('[data-copy]');
    if (copy) {
      var pre = copy.parentElement.querySelector('pre');
      if (!pre) return;
      var done = function () {
        var was = copy.textContent;
        copy.textContent = 'Copied';
        /* One shot, tied to the press that caused it. */
        setTimeout(function () { copy.textContent = was; }, 1400);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(pre.textContent).then(done, function () {});
      }
    }
  });
})();
