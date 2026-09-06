# Propz browser extension

Shows a small floating "Send Propz" button, automatically, on any page a
creator has registered — including platforms like GoFundMe that never let a
page owner add a script tag at all. Nothing changes about the page itself;
the button is injected by the extension, in the visitor's own browser, using
[`chrome.scripting.executeScript`](https://developer.chrome.com/docs/extensions/reference/api/scripting)
(the only reliable way to do this — a plain injected `<script>` tag gets
blocked outright by any page with a real Content-Security-Policy, confirmed
against a real strict-CSP test page while building this).

## How it fits together

1. **You install it and set up your profile** (name + receiving wallet —
   public address only, same as everywhere else in Propz) once, in the
   onboarding page that opens automatically on install.
2. **You browse to a page you want your tip button on** — your own
   GoFundMe campaign, a stream page, anywhere — and click the Propz icon in
   your toolbar, then "Show my tip button on this page."
3. That registers the page's URL with Propz's backend (`PROPZ_PAGES`, a
   Cloudflare KV namespace — see `app/api/extension/register/route.ts` and
   `app/api/extension/lookup/route.ts`). From then on, **every visitor with
   the extension installed** sees your tip button there — not just you.
4. `content.js` runs on every real page load, asks the background worker
   (`propz:check`) whether the current URL is registered, and if so the
   background worker injects the widget directly into the page's main
   world. The injected widget is the same design as `public/widget.js`
   (Shadow DOM, floating button, expanding panel with an iframe pointing at
   `/embed`) — just re-declared standalone in `background.js`, since
   `executeScript`'s `func` argument has to be fully self-contained and
   can't import anything.
5. The background worker also watches `chrome.webNavigation.onHistoryStateUpdated`
   — most of the platforms this is built for (X/Twitter, Instagram, YouTube,
   TikTok, Facebook, etc.) route internally via the History API and never
   fire a real page load when a visitor moves from one profile or post to
   another. Without this, the button would only ever appear after a manual
   hard refresh of an exact registered URL, which defeats the point on
   sites like these. Each same-document navigation re-checks the new URL
   and mounts, swaps, or tears down the widget accordingly, so it correctly
   disappears when a visitor SPA-navigates away from a registered page and
   appears when they land on one — all without a full reload.

Registering or reverting a page from the toolbar popup also takes effect on
that tab immediately, without needing a reload, for the same reason.

No accounts anywhere in Propz, by design, so there's no login here either.
The only thing standing between someone and re-registering or deleting a
page they don't own is possessing the `editToken` returned from the first
registration (stored locally, in `chrome.storage.local`, never sent
anywhere except back to Propz to prove you're the one who registered that
page). That's a real, known limitation — fine for a small number of people
who know each other, worth revisiting before this scales past that.

## Load it locally (unpacked)

1. Go to `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**, and select this `extension/` folder.
4. The onboarding page opens automatically. Set your name and wallet.
5. Browse to any page, click the Propz icon, "Show my tip button on this
   page."

Works the same way in any Chromium-based browser (Edge, Brave, Arc, etc.) —
just use that browser's equivalent of `chrome://extensions`.

## Publishing it for real

This repo only contains the *source*. Every store below needs its own
developer account, created and paid for (where there's a fee) by whoever
will own the listing — nothing in this repo can do that step for you. Once
an account exists, `bash scripts/build-extension.sh` builds the packages
each submission actually uploads:

- `dist-store/propz-extension-store.zip` — Chrome Web Store, Edge Add-ons,
  and the Gumroad mirror all use this exact same package.
- `dist-store/propz-extension-firefox.zip` — Firefox Add-ons (AMO) only; it
  swaps in `manifest.firefox.json` (background script instead of a service
  worker, plus the `browser_specific_settings.gecko` block AMO requires).

Both zips are gitignored (`dist-store/` — same as `dist/`) since they're
regenerated from source, not committed artifacts.

| Store | Fee | Listing draft | Notes |
|---|---|---|---|
| [Chrome Web Store](https://chrome.google.com/webstore/devconsole) | $5 one-time | `store/LISTING.md` | Broad host permission (`http://*/*`, `https://*/*`) puts this in Chrome's most-scrutinized review tier — expect follow-up questions about why; the honest answer is this README. |
| [Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/) | Free | `store/LISTING-edge.md` | Same package as Chrome (Chromium/MV3-compatible); form closely mirrors Chrome's. |
| [Firefox Add-ons (AMO)](https://addons.mozilla.org/developers/) | Free | `store/LISTING-firefox.md` | Uses the firefox zip above; verify `world: "MAIN"` scripting actually works on a real Firefox build before submitting (see that file). |
| [Gumroad](https://gumroad.com/) | Free (list at $0 / pay-what-you-want) | `store/LISTING-gumroad.md` | Not a real extension store — no review, no auto-update. A direct-download mirror only; keep the official store listings as the primary install path once they're live, and update the placeholder links in that file once they are. |
| Safari (App Store) | $99/year Apple Developer Program | — | Needs a Mac with Xcode: run Apple's `safari-web-extension-converter` against this `extension/` folder to generate a wrapper macOS app, then submit that through App Store Connect. Not something buildable from this repo alone — nothing here has macOS/Xcode access. Ask again once you're on a Mac with a Developer Program account and this can be worked through step by step. |

All four non-Safari listing drafts share the same privacy policy URL:
`https://propz.saylorinnovations.com/extension/privacy`
(`app/extension/privacy/page.tsx`) — confirmed live. Keep it in sync by hand
if what the extension collects ever changes.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | MV3 manifest for Chrome/Edge/Gumroad — permissions, content script registration |
| `manifest.firefox.json` | Firefox variant — `background.scripts` instead of `service_worker`, plus the `gecko` id AMO requires. Swapped in at build time, never shipped as-is. |
| `background.js` | Service worker: all network calls, and the widget-mounting logic (`syncPropzWidget`) that gets injected into pages |
| `content.js` | Runs on every page; just pings the background worker |
| `popup.html` / `popup.js` | Toolbar icon popup — shows/edits this page's registration |
| `onboarding.html` / `onboarding.js` | First-run setup (name + wallet) |
| `validators.js` | Mirrors `app/lib/tip.ts`'s address validators — kept in sync by hand, no shared build step |
| `icons/` | Rendered from `public/favicon.svg` at 16/48/128px |
| `store/` | Chrome Web Store submission draft (`LISTING.md`) plus screenshot — see "Publishing it for real" above for the other stores' drafts |
