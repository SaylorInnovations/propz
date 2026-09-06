# Gumroad listing — Propz browser extension

Gumroad isn't a browser extension store — there's no review process and, more
importantly, **no auto-update mechanism**, so this is a secondary mirror for
people who want it before the Chrome/Edge/Firefox review finishes, or who
just prefer downloading it directly. The Chrome Web Store, Edge Add-ons, and
Firefox listings should stay the primary install paths once they're live;
link to them from this page once they exist.

## Setup on Gumroad

1. Create the product as **"digital product" → file download**.
2. **Price:** set a $0 minimum with "pay what you want" turned on — matches
   the README's commitment that Propz is free, open-source, and
   self-hostable. Do not list it as a paid product; that would directly
   contradict the project's own stated terms.
3. **File to upload:** `dist-store/propz-extension-store.zip` (same package
   built for Chrome/Edge — rebuild first with `bash scripts/build-extension.sh`
   if `extension/` has changed since the last zip).
4. **Cover image:** `extension/store/screenshot-1280.png`.

## Title

Propz — Tip Jar (browser extension)

## Short description (shown on the product card)

A free, non-custodial crypto tip button for any page — including social
profiles and fundraisers that never let you add your own code.

## Full description

Propz is a non-custodial crypto tip jar — no signup, no platform custody,
never touches a private key. This is the browser extension: it shows your
tip button automatically on any page you register, including places like
GoFundMe, X/Twitter, and Instagram that block a page owner from adding a
script tag at all.

**How it works:** install it, set your display name and public receiving
wallet (Solana and/or Base), browse to the page you want your tip button
on, and click "Show my tip button on this page" from the toolbar icon.
From then on, anyone else who also has Propz installed sees your button
there automatically.

**Why this is on Gumroad instead of just the Chrome Web Store:** it's the
same free download, offered here as a direct mirror — useful if you want it
before store review finishes, or you'd rather sideload it than wait. This
is entirely optional; the Chrome Web Store / Edge Add-ons / Firefox Add-ons
listings are the primary install path once live and get automatic updates,
this one doesn't.

**This is real, open-source software, not a scam extension:**
- Full source is public: https://github.com/SaylorInnovations/propz/tree/feat/browser-extension/extension
  — read every line before installing. **Repoint this to the `main` branch
  URL once `feat/browser-extension` is merged** (it isn't yet as of this
  writing) — a branch link is fine short-term but shouldn't be the
  permanent one in a live listing.
- MIT-licensed.
- Privacy policy: https://propz.saylorinnovations.com/extension/privacy
- Never asks for a seed phrase or private key — only a public receiving
  address, the same as pasting it anywhere else.
- No accounts, no tracking, no analytics.

## Installation instructions (since this isn't from an official store)

Because this comes from a direct download rather than the Chrome Web Store,
your browser won't install it with one click — you load it in "developer
mode," the same way any developer tests an unpublished extension:

1. Download and unzip the file.
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`
   — any Chromium-based browser).
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the unzipped folder.
5. The onboarding page opens automatically — set your name and wallet.

Firefox doesn't support permanently loading unpacked/unsigned extensions
outside of Developer Edition/Nightly — Firefox users should use the Firefox
Add-ons listing instead (link once live), not this Gumroad zip.

**Note on trust:** loading via developer mode means Chrome shows an "these
extensions may have been added without your knowledge" warning banner on
every browser restart — that's normal for any unpacked extension, not a
sign something's wrong, but it's also exactly why the Chrome Web Store
listing (once live) is the better default for most people: it removes that
warning and adds automatic updates.

## Tags

crypto, solana, tip-jar, browser-extension, chrome-extension, web3,
creator-tools, donations

## What's NOT ready yet

- The Chrome/Edge/Firefox links above are placeholders until those listings
  are actually submitted and approved — fill them in once live so this page
  doesn't dead-end.
- A public GitHub (or equivalent) link for "read the source" needs the repo
  actually pushed somewhere public — this workspace's repo doesn't currently
  have a public remote configured; add one before publishing this listing,
  or drop that bullet if it's staying private.
