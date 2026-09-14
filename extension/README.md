# Propz Tip Button

A Manifest V3 publishing utility for creators and website owners. Enter a
public Solana or Base receiving address, customize the jar, and copy:

- **Floating button:** paste into the website's custom code/footer before
  `</body>` and publish. Requires a platform that permits scripts.
- **Embedded card:** paste into a Custom HTML/Embed block and publish.
  Requires support for iframes.
- **Shareable link:** use in bios, videos, newsletters, posts, and platforms
  that do not accept HTML.

Visitors do not need the extension. Installing it does not modify a website.
Saved settings use `chrome.storage.sync`. Generation works locally; Preview
opens the hosted jar in a normal browser tab. Previously published code does
not change when settings change: copy and publish the new code again.

## Local testing

1. Open `chrome://extensions`, enable Developer mode, and Load unpacked
   from `extension/`.
2. Enter a receiving address and customize the card. Save settings, close
   and reopen the popup, and verify the saved details.
3. Copy each output. Test the widget and iframe on a page you control,
   including a fresh browser without the extension. Confirm the recipient.
4. Test missing/invalid addresses, mixed valid/invalid wallets, special
   characters in text, and switching output formats.
5. Verify Preview opens the configured jar. No payment is required.

## Packaging

Run `python3 scripts/package-extension.py` from the repo root. This produces
`propz-extension.zip` with only the runtime files and icons; the manifest is
at its root. Run `node --test tests/extension-publish.test.mjs` for generation
and validation checks. See `STORE_LISTING.md` for submission copy.

Version 1.1.0 replaces the original private browsing overlay with publishing
tools and removes the content script and install-time Studio tab. Existing
saved card fields are reused; the old enabled setting is ignored. Reload
previously open tabs after updating from 1.0.0 to clear the former overlay.

Bump the manifest version for subsequent uploaded packages.
