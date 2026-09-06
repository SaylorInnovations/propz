# Firefox Add-ons (addons.mozilla.org) listing — Propz

Submitted at https://addons.mozilla.org/developers/ — free, no listing fee
(unlike Chrome's one-time $5). Package: `dist-store/propz-extension-firefox.zip`
(built by `bash scripts/build-extension.sh`), which carries
`manifest.firefox.json` renamed to `manifest.json` inside the zip — the only
difference from the Chrome package is the `background` key (`scripts`
instead of `service_worker`, since Firefox's MV3 support runs the
background script as an event page) and a `browser_specific_settings.gecko`
block AMO requires for a stable extension ID.

## Name

Propz — Tip Jar

## Summary (250 char max)

Shows a creator's non-custodial crypto tip button automatically on pages
they've registered — no signup, no platform custody.

## Description

Same body copy as `LISTING.md`'s "Detailed description" — reused verbatim,
AMO has no Firefox-specific wording requirement here.

## Categories

Other (AMO's category list doesn't have a crypto/tipping bucket as of this
writing — check the current list at submission time, it may have changed).

## Tags

crypto, tip-jar, solana, donations, creator-tools

## License

MIT — matches the repo's `LICENSE`. AMO asks for this explicitly on the
submission form; pick "MIT License" from its dropdown.

## Source code disclosure

AMO's automated review flags any extension with minified, bundled, or
otherwise non-human-readable code and then requires a separate source
upload + build instructions to manually verify what's really running.
`background.js` and every other file here are hand-written, unminified
vanilla JS with no build step — so this shouldn't trigger, but if AMO's
reviewer asks anyway, the answer is: "no build step; the submitted zip
already is the source," and the full sources are also public at this
repo's `extension/` directory.

## Privacy policy URL

https://propz.saylorinnovations.com/extension/privacy

(Same one used for the Chrome listing — confirmed live.)

## Permission justifications

Mirror `LISTING.md`'s Chrome section — AMO asks the same "why does this
extension need X" questions per-permission during submission. `webNavigation`
and `scripting` are supported the same way in Firefox as Chrome; nothing
extra to explain there. Firefox does not have a separate "broad host
permission" review tier the way Chrome does, but the request is still
`http://*/*` + `https://*/*` and reviewers may still ask about it — same
honest answer applies: a creator can register literally any page, so the
extension can't know the domain set in advance.

## Compatibility

`strict_min_version` in the manifest is set to Firefox 128 (needed for the
`scripting.executeScript` `world: "MAIN"` option `background.js` relies on
to inject the widget into the page's own JS context rather than an isolated
one). Before submitting, install `dist-store/propz-extension-firefox.zip`
temporarily (`about:debugging` → "This Firefox" → "Load Temporary Add-on" →
pick the zip, or point it at `extension/manifest.firefox.json`'s directory
directly) and confirm the tip button actually mounts on a registered test
page — this hasn't been run against a real Firefox build yet, only verified
by reading Mozilla's compatibility tables, so treat this as the one thing
worth manually checking before submitting.

## Assets

Same screenshot and icons as the Chrome listing (`extension/store/`,
`extension/icons/`) — AMO accepts the same image dimensions.
