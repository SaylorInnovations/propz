# Chrome Web Store submission — version 1.1.0

## Name
Propz Tip Button

## Summary
Build a crypto tip jar for your website or content. Copy a floating button, embedded card, or shareable Solana and Base link.

## Description (paste into the store)
Propz helps creators and website owners add a crypto tip jar to their websites and content.

Enter your public Solana or Base wallet address, customize your jar, and choose how to publish it:

• Floating website button — copy a small snippet into your website's custom code or footer. Visitors click “Send Propz” to open your tip card.
• Embedded tip card — paste the iframe code into a Custom HTML or Embed block.
• Shareable link — add your jar to a bio, video description, post, or newsletter.

Customize your display name, message, button label, and accent color. Save your settings with Chrome sync and preview your jar in a new tab.

You must paste the generated code into a website you can edit and publish that website. Installing the extension does not automatically change your site. Visitors do not need the extension. Some platforms restrict scripts or iframes; use the shareable link on those platforms.

Supporters can send SOL or USDC on supported networks through the hosted Propz payment page. Payments require approval in a compatible wallet, and Base payments may require two approvals. Propz never asks for private keys or seed phrases and never takes custody of funds. Payments include a disclosed 0.08% platform fee.

No Propz account required. Built by Saylor Innovations.

## Category
Developer Tools — publishing HTML snippets for website integration is the
extension's primary utility. Select the closest available category in your
dashboard; category choice is not a guarantee of review approval.

## Language
English

## Single purpose
Help creators configure a crypto tip jar and generate website widget code,
iframe embed code, or a shareable link for publishing their jar.

## Permission justification: storage
Save the creator's public receiving addresses and card appearance settings
using Chrome storage sync so they can reuse their configuration.

## Remote code answer
The extension does not execute remotely hosted code. Its popup and code
generator are packaged locally. Generated script tags are text for users to
copy into their own websites, not scripts executed inside the extension.
Preview opens the hosted Propz site in a regular browser tab.

## Privacy policy URL
https://propz.saylorinnovations.com/extension-privacy

Deploy and verify the revised policy before submitting this version.

## Privacy practices
Generating code runs locally. Saving uses Chrome sync. Copy writes to the
clipboard. Preview sends public wallet addresses and card text to the hosted
Propz site in its URL; publishing code or links makes these details public.
Hosting receives ordinary request metadata. No browsing history, page
content, clipboard contents, private keys, or passwords are read.

Review the dashboard definitions for financial/payment information (public
wallet addresses), personally identifiable information (a creator's name),
and user-provided content (card text). Do not certify that no data is ever
transmitted. Verify actual hosting logs/analytics and final declarations
with the operator before certifying the privacy tab.

## Reviewer instructions
No login or payment is required. Enter a public Base receiving address in
the popup (for a non-payment test only, 0x1111111111111111111111111111111111111111
is syntactically valid; it is not a suggested donation destination).
Customize the card, Save settings, close and reopen the popup, and confirm
persistence. Select each output format and Copy. Paste the floating widget
into an HTTPS test page you control and open it without the extension.
Click the button and confirm the configured card appears. Test the iframe
in a Custom HTML page and open the shareable link. Preview opens a normal
tab. No access to arbitrary browsing pages is requested.

## Store assets and final steps
- Upload the new 1.1.0 ZIP to the existing dashboard item.
- Replace old copy describing a private browsing overlay.
- [x] Screenshot of the builder popup, composited into a browser-window
  mockup showing the floating widget use case — 1280×800, full bleed.
  See `../store-assets/screenshot-1-1280x800.png`. It's the real popup UI
  rendered from `extension/popup.html`, not a mockup of the form itself —
  only the surrounding browser chrome and page behind it are illustrative.
  Consider adding 1-2 more screenshots (embed card, shareable link output)
  before submitting; 5 max.
- [x] 440×280 promotional tile — `../store-assets/small-promo-440x280.png`.
- [x] 128×128 extension icon (96×96 art + 16px transparent padding) —
  `../store-assets/icon-128.png`, already swapped into
  `extension/icons/icon128.png` and repacked into `propz-extension.zip`.
  `icon16.png`/`icon32.png`/`icon48.png` still come from the old source
  image and don't follow the same padding ratio — regenerate if you want
  full consistency across sizes.
- [x] Bonus: 1400×560 marquee image (optional, only needed for the
  marquee featured section) — `../store-assets/marquee-1400x560.png`.
- Verify the live privacy page and hosted widget/card URLs work.
- Complete Privacy, Distribution, and test instructions, then submit.

References:
- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/images
- https://developer.chrome.com/docs/webstore/best-practices
