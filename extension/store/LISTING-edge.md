# Microsoft Edge Add-ons listing — Propz

Submitted at https://partner.microsoft.com/dashboard/microsoftedge/ — a free
Microsoft Partner Center account (no fee, unlike Chrome's $5). Package:
`dist-store/propz-extension-store.zip` — the exact same zip built for the
Chrome Web Store. Edge is Chromium-based and supports the same Manifest V3
APIs this extension uses (`scripting`, `webNavigation`, `world: "MAIN"`), so
there's no separate Edge build the way Firefox needs one.

Every field below mirrors `LISTING.md` (the Chrome draft) — Microsoft's
submission form is deliberately close to Chrome's, since most developers
reuse the same package. Only the differences are called out.

## Name / Summary / Detailed description / Category / Permission justifications / Privacy declarations

Identical to `LISTING.md` — copy those fields as-is.

## Privacy policy URL

https://propz.saylorinnovations.com/extension/privacy

## Differences from the Chrome submission

- **Support contact:** Edge's form requires a support email or URL up
  front (Chrome's is account-level, filled in once and reused). Use
  `https://saylorinnovations.com/` — same contact point the privacy policy
  itself points to.
- **Age rating questionnaire:** Microsoft runs a ratings questionnaire
  (violence, gambling, etc. — all "no" for this extension) that Chrome
  doesn't have. Answer honestly; nothing here should trip any of it.
- **Review time:** Typically faster than Chrome's broad-host-permission
  tier, but still expect follow-up questions about the `http://*/*` +
  `https://*/*` host permission for the same reason given in `LISTING.md`.
- **Certification:** Edge runs its own Microsoft-side certification pass in
  addition to a policy review — no action needed, just don't be surprised
  if it takes a separate visible step in the dashboard.

## Assets

Same screenshot and icons as the Chrome listing.
