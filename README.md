# Propz

**Give credit. Send value.**

Propz is a non-custodial crypto tip jar. Anyone — a creator, streamer, builder,
gamer, or a cause on a fundraising page — publishes a Propz card once, then
drops it *anywhere they already have a presence*: a bio link, a stream
overlay, a website, a video description, a GoFundMe post, a printed QR code.
Supporters pick an amount, approve one transaction in their own wallet, and
the funds move straight from supporter to recipient on Solana or Base. Propz
never holds the money — it only writes a disclosed **0.08% platform fee**
into the same transaction the supporter signs and sees before approving.

No signup, no dashboard, no custody. It's a link, an embed, or a QR code
pointing at a piece of math anyone can read.

## How it works

1. **Build a card** at `/` (the Studio) — add a display name, a message, and
   at least one public receiving address (Solana and/or Base). Private keys
   never touch the product; only public addresses go in.
2. **Publish it** as whichever surface fits: an `<iframe>` embed snippet, a
   hosted link (`/jar`), a downloadable QR PNG, or a machine-readable JSON
   manifest (`/api/manifest`) for agents/wallets to read directly.
3. **Supporters pay directly.** For Solana, the card points wallets at a
   [Solana Pay "transaction request"](https://docs.solanapay.com/spec)
   endpoint (`/api/pay/solana`) that returns an *unsigned* transaction
   containing two transfers — the creator's cut and the fee — for the
   supporter's wallet to sign. For Base, the wallet sends two sequential
   USDC transfers (no single-signature split exists on EVM without a router
   contract); the creator's transfer always goes first, so a declined second
   prompt still pays the creator in full and only skips the fee.

The split is computed in `app/lib/fee.ts` (`splitUnits`) and always rounds
the fee down, landing at zero on very small tips rather than ever asking for
more than the number shown on the button.

## The 0.08% fee, and why it's hardcoded

`PROPZ_FEE_SOLANA` and `PROPZ_FEE_BASE` in `app/lib/fee.ts` are fixed
addresses, not environment variables. That's intentional: Propz is free to
download, self-host, and modify, but every instance that keeps those
constants routes its disclosed 0.08% fee back to the Propz operator
(Saylor Innovations) — that's how the project stays funded. The fee is never
hidden: it's shown on the tip button total, the jar page trust badges, the
Studio's publish panel, and the `platformFeeBps` field of the manifest JSON.
If you fork this to run fully independently, update those two constants —
just don't ship a build that changes them while still calling itself Propz.

Both addresses are verified well-formed (a valid on-curve Solana public key
and a valid 20-byte EVM address) — malformed fee wallets would make every
payment fail outright, not just skip the fee, since `/api/pay/solana`
rejects the whole transaction if any address in it doesn't parse. Format
validity isn't the same as custody, though: confirm you hold the private
keys for both `PROPZ_FEE_SOLANA` and `PROPZ_FEE_BASE` before relying on them
in production.

## Platform support

**Using Propz** (creators publishing a card, supporters paying) needs
nothing installed — it's a web page, an `<iframe>`, a link, or a QR code, so
it already works the same on Windows, macOS, Linux, iOS, and Android through
any browser or wallet app. Mobile is a first-class case, not an afterthought:
the payment flow falls back to `https://` universal links for Phantom,
MetaMask, and Coinbase Wallet, and specifically detects the in-app browsers
that block wallet popups (Instagram, TikTok, X, LINE, Linktree) to route
around them (`app/lib/tip.ts`).

**Building/self-hosting Propz** (cloning this repo and running it) works on
Windows, macOS, and Linux too, but through two different paths:

- `npm run dev` and `npm run start` run anywhere — they use `cross-env` so
  the env var syntax works in PowerShell, cmd.exe, and any POSIX shell alike.
- `npm run install:ci` and `npm run build` intentionally stay Linux-only
  (`bash`, GNU `timeout`, `flock`) — they're the bounded, locking wrapper the
  managed Sites deploy pipeline runs, not a general-purpose script. **On
  Windows or macOS, skip the wrapper and call the underlying cross-platform
  tools directly:**
  ```bash
  npm install          # instead of npm run install:ci
  npx vinext build      # instead of npm run build
  npx vinext start      # instead of npm run start (or npm run start works as-is)
  ```
  On Windows, run these from PowerShell, cmd.exe, WSL, or Git Bash — all
  work, since nothing left in this path shells out to `bash`.

## Quick start

Requires Node.js `>=22.13.0`.

```bash
npm install    # or `npm run install:ci` on Linux — see Platform support above
npm run dev    # start the Vite/vinext dev server
```

Copy `.env.example` to `.env` and set `SOLANA_RPC_URL` to a paid RPC
endpoint (Helius, Triton, etc.) before going live — the public
`clusterApiUrl("mainnet-beta")` fallback works for local testing only and
rate-limits quickly.

## Build & deploy

```bash
npm run build   # produces the deployable Cloudflare Workers/Sites artifact
npm run start   # run the built app locally
```

This is a [vinext](https://github.com/cloudflare/vinext) app that ships as a
Cloudflare Worker (`worker/index.ts`) serving static assets plus API routes
under `app/api/`. `wrangler.jsonc` declares the Workers config (assets
binding, image optimization). No database is used — `db/schema.ts` starts
empty and D1 is optional infrastructure this app doesn't currently need.

## Project layout

| Path | What's there |
|---|---|
| `app/studio.tsx`, `app/page.tsx` | The card builder (`/`) |
| `app/jar/page.tsx` | Full-page hosted tip card (`/jar`) |
| `app/embed/page.tsx` | Compact `<iframe>`-friendly card (`/embed`) |
| `app/components/tipjar.tsx` | The tip card UI + wallet payment flow |
| `app/lib/fee.ts` | The 0.08% split math and fee wallet addresses |
| `app/lib/tip.ts` | Config parsing, address validation, payment URI builders |
| `app/api/pay/solana/route.ts` | Solana Pay transaction-request endpoint |
| `app/api/manifest/route.ts` | Machine-readable payment manifest (`/api/manifest`) |
| `app/api/qr/route.ts` | Static downloadable QR PNG (`/api/qr`) |
| `public/propz-logo.png`, `propz-logo.svg`, `favicon.svg`, `og.png` | Brand assets — overwrite in place to rebrand |

## Security notes

- Propz never asks for a seed phrase or private key — only public receiving
  addresses.
- Propz never custodies funds. Every wallet the transaction touches (creator
  and fee) is written into the transaction the supporter inspects and signs
  in their own wallet.
- The QR/link surfaces are static and safe to reuse indefinitely for a given
  wallet + amount, but always confirm the destination address in your wallet
  before approving any payment.

## License

MIT — see [`LICENSE`](./LICENSE). See "The 0.08% fee, and why it's
hardcoded" above for the one thing worth knowing before you fork it.
