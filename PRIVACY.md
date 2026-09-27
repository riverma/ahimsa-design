# Privacy

**No data collected. No tracking. 100% private.**

The design system is a stylesheet and some fonts. It makes no network
requests, sets no cookies, and contains no analytics, no telemetry and no
third-party code. `tools/check-offline.mjs` fails the build on any remote
`@import`, CDN reference, remote `url()` or remote `fetch` anywhere in
`src/`, `dist/` or `docs/`.

The documentation site at <https://ahimsa-design.riverma.com> is static HTML
served by GitHub Pages. It has no analytics and no cookie banner. It stores
exactly one thing, in your browser's `localStorage` and nowhere else:

| Key | Value | Why |
|---|---|---|
| `ahimsa-theme` | `day` or `night` | So the aesthetic you picked is still the one you get next time. |

Nothing is sent anywhere. Clearing your browser storage removes it.

GitHub, as the host, can see the requests that fetch the page itself. That is
true of any hosted site and is not something this project collects or retains.
