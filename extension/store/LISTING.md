# Chrome Web Store listing — Propz

## Name

Propz — Tip Jar

## Summary

Shows a creator's non-custodial crypto tip button automatically on pages they've registered — no signup, no platform custody.

## Detailed description

Propz lets creators, streamers, and fundraisers accept direct crypto tips on pages that would never let them add a script tag — GoFundMe campaigns, marketplace profiles, anywhere a page owner doesn't control the HTML.

Install the extension, set your display name and public receiving wallet (Solana and/or Base — never a private key), then click the toolbar icon on any page you want your tip button on and choose "Show my tip button on this page." From then on, every visitor who also has Propz installed sees your tip button there automatically — not just you.

How a tip works: a supporter picks an amount and approves one transaction in their own wallet. Funds move straight from supporter to creator on-chain. Propz never holds the money — it only adds a disclosed 0.08% platform fee into the same transaction the supporter signs and sees before approving.

Features:

- Automatic tip button on any page you register, including sites that block script injection outright
- Works across SPA navigation (X/Twitter, Instagram, YouTube, TikTok, Facebook) without needing a page reload
- Solana and Base support, direct wallet-to-wallet settlement
- No accounts, no login, no platform custody of funds
- No analytics, no advertising, no tracking

Privacy matters. Propz stores your name and wallet address locally in your browser. When you visit a page, the extension checks the current page's top-level URL against Propz's registration list to decide whether to show a button there — that check is the only data that leaves your device during ordinary browsing, and the lookup itself is not logged or retained. Registering a page publishes that page's URL, your display name, color choice, and wallet address so visitors can see and use your tip button — that's the entire point of registering.

## Category

Productivity (or Social & Communication, if Productivity is a poor fit for how Chrome buckets tipping tools this cycle)

## Language

English

## Single purpose

Show a page owner's registered Propz tip button on webpages they've chosen, so visitors can send a non-custodial crypto tip directly to the creator's own wallet.

## Permission justification

**Storage:** Saves the user's own display name, wallet address, color preference, and the edit tokens proving which pages they registered.

**Active tab:** Used when the user clicks the toolbar icon, to read and register/unregister the page currently open.

**Scripting:** Injects the tip-button widget into a registered page's content. A plain injected `<script>` tag is blocked outright by pages with a real Content-Security-Policy (confirmed against GoFundMe and similar sites), so `chrome.scripting.executeScript` is the only reliable way to render the widget there.

**Web navigation:** Many of the platforms this is built for (X/Twitter, Instagram, YouTube, TikTok, Facebook) route internally via the History API and never fire a full page load when a visitor moves between profiles or posts. Without watching navigation events, the tip button would only ever appear after a manual hard refresh of an exact registered URL.

**Website access (all sites):** A creator can register literally any page as their tip surface — their own site, a GoFundMe campaign, a stream page — and the extension can't know in advance which domains will be registered. Broad host permission is what lets the button render correctly wherever a creator has chosen to put it. The extension does not read, collect, or transmit page content — only the current page's top-level URL, to check registration status.

## Privacy declarations

- Does not sell user data.
- Does not use user data for purposes unrelated to the extension's single purpose.
- Does not use user data for creditworthiness or lending.
- Does not collect authentication, financial, health, location, or personal communications data (public wallet addresses are not authentication or financial-account credentials — no private keys are ever collected).
- Does not use remote code beyond fetching this extension's own registration/lookup data from its own API.

Review every declaration against the current Chrome Web Store form before submission — wording and categories can change.

## Privacy policy URL

https://propz.saylorinnovations.com/extension/privacy

(Already live and deployed — confirmed 200 on 2026-09-05.)

## Assets

- `store/screenshot-1280.png` — 1280×800, live capture of the actual tip-jar UI (`/jar` demo route) the extension injects onto registered pages.
- Icons already present at `../icons/icon16.png`, `icon48.png`, `icon128.png`.
- No promo tile (440×280) or marquee (1400×560) yet — optional for submission, only required for featured placement.
