# Propz Tip Jar mobile app

Native Expo app for creating and sharing a non-custodial Propz tip jar. The app stores public jar details on the device, generates a hosted Propz URL and QR code, and opens the supporter flow in the system browser. It never requests private keys or seed phrases and never holds funds.

## Local verification

```bash
npm run typecheck
npm run doctor
npx expo config --type public
```

Production builds and submissions use EAS profiles in `eas.json`. They require the account owner to sign in and accept Apple/Google agreements.

## Release materials

- `store/STORE_LISTING.md` — ready-to-paste App Store and Play Store copy
- `store/PRIVACY_DECLARATIONS.md` — conservative disclosure worksheet
- `store/REVIEW_NOTES.md` — reviewer instructions and policy positioning
- `store/RELEASE_CHECKLIST.md` — remaining owner and submission gates
- `store/SCREENSHOT_PLAN.md` — required capture set and captions

