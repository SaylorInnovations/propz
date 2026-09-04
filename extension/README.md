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
4. `content.js` runs on every page, asks the background worker (`propz:check`)
   whether the current URL is registered, and if so the background worker
   injects the widget directly into the page's main world. The injected
   widget is the same design as `public/widget.js` (Shadow DOM, floating
   button, expanding panel with an iframe pointing at `/embed`) — just
   re-declared standalone in `background.js`, since `executeScript`'s `func`
   argument has to be fully self-contained and can't import anything.

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

This repo only contains the *source*. Actually publishing to the Chrome Web
Store needs a Google developer account (one-time $5 registration fee) that
only you can create — nothing here can do that step for you. Once you have
one:

1. Zip the contents of this folder (not the folder itself — the manifest
   needs to be at the zip's root).
2. Upload it at the [Chrome Web Store Developer
   Dashboard](https://chrome.google.com/webstore/devconsole).
3. You'll need a short listing description, a few screenshots, and a
   privacy-practices disclosure. Worth knowing going in: the
   `host_permissions` covering every http/https page (required for the
   automatic-detection behavior to work anywhere) puts this in Chrome's
   most-scrutinized review tier — expect the review to take longer and ask
   follow-up questions about why that scope is needed. The honest answer
   (this repo's whole README) is the answer.
4. Firefox and Safari both need their own separate submissions with their
   own review processes — not covered here; ask if you want that too.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | MV3 manifest — permissions, content script registration |
| `background.js` | Service worker: all network calls, and the widget-mounting logic (`mountPropzWidget`) that gets injected into pages |
| `content.js` | Runs on every page; just pings the background worker |
| `popup.html` / `popup.js` | Toolbar icon popup — shows/edits this page's registration |
| `onboarding.html` / `onboarding.js` | First-run setup (name + wallet) |
| `validators.js` | Mirrors `app/lib/tip.ts`'s address validators — kept in sync by hand, no shared build step |
| `icons/` | Rendered from `public/favicon.svg` at 16/48/128px |
