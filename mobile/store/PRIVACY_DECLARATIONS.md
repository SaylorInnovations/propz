# Privacy and policy declaration worksheet

This worksheet is intentionally conservative. Reconfirm every answer against the production binary and current portal wording at submission time.

## Product behavior

- No account or login.
- No ads or cross-app tracking.
- No analytics SDK in the native app.
- No private-key, seed-phrase, contact, photo, location, microphone, camera, or advertising-ID access.
- Public receiving addresses, optional display name, optional message, and accent are stored locally with Expo SQLite key-value storage.
- The app writes to the clipboard only after the user taps Copy link; it does not read the clipboard.
- The app opens the hosted Propz page only after the user taps Open payment page. The public receiving addresses and optional display text are included in that URL.
- The hosted page and hosting provider receive ordinary request metadata. Blockchain transactions are public.

## Apple App Privacy draft

Use the conservative disclosure below because opening the hosted flow sends jar data to a service operated for Propz:

| Data type | Collected | Linked to identity | Tracking | Purpose |
| --- | --- | --- | --- | --- |
| Name | Optional | Yes | No | App functionality |
| Other user content (jar message) | Optional | Yes | No | App functionality |
| Other financial information (public wallet address) | Yes | Yes | No | App functionality |

Do not declare purchases, payment information such as card numbers, precise location, contacts, identifiers, usage analytics, diagnostics, advertising, or tracking unless the production app or hosted flow changes to collect them.

## Google Play Data safety draft

- Does the app collect or share required user data types? `Yes — collect only; no sale or third-party advertising share.`
- Financial info → Other financial info (public receiving address): collected for app functionality; required to create a jar; not used for advertising.
- Personal info → Name: optional; collected for app functionality only if supplied.
- App activity / Other user-generated content: optional jar message; collected for app functionality only if supplied.
- Data encrypted in transit: `Yes` for the HTTPS hosted flow.
- Account deletion: `Not applicable — the app has no accounts.` Users can replace local values or clear app data/uninstall. Hosted request logs and public blockchain transactions have separate retention constraints.
- Independent security review: `No`, unless one is completed before submission.

Do not select “Cryptocurrency wallet” merely because the app accepts a public address: Propz does not create, store, import, or control wallets. For Google’s Financial features declaration, the closest conservative choices are `Mobile payments and digital wallets`, `Money transfer and wire services`, and, if the form allows explanatory context, `Other`, with the non-custodial explanation from the review notes. Do not select exchange, lending, trading, NFT, or crowdfunding features.

## Rating/content answers

- Gambling, contests, simulated gambling: none.
- User-generated public feed or social features: none.
- Purchases of digital content or in-app feature unlocks: none.
- Crypto mining, exchange, trading, staking, rewards for tasks, or speculative earnings claims: none.
- Unrestricted web access: no embedded browser; user-initiated links open the system browser.
- Recommended age positioning: general audience, not designed for children; complete each store questionnaire truthfully based on its current questions.

