#!/usr/bin/env node
// Safety gate: refuses to build if app/lib/fee.ts's platform fee wallets or
// rate have drifted from what they're supposed to be. Runs on every
// `npm run build` (wired into scripts/build-verified.sh, right before the
// actual vinext build), so a change to these values — accidental or
// otherwise — fails the build instead of silently shipping.
//
// This is a source-level check, not cryptographic enforcement: someone with
// write access to this file could edit both fee.ts and the EXPECTED_*
// constants below in the same change. It's a deliberate speed bump and a
// loud, unmissable diff — not a substitute for branch protection requiring
// review before anything lands on main.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEE_FILE = path.join(__dirname, "..", "app", "lib", "fee.ts");
const EXPECTED_SOLANA = "341CaU9NT2PJftYakDsrchSK3PatVuo4yvzDA7zQbh65";
const EXPECTED_BASE = "0x66d24018F3c8e5e5C4E703C8e378D3E7Df3D9C74";
const EXPECTED_BPS_LITERAL = "BigInt(8)";

const src = fs.readFileSync(FEE_FILE, "utf8");

const checks = [
  [src.includes(`"${EXPECTED_SOLANA}"`), `PROPZ_FEE_SOLANA must be exactly "${EXPECTED_SOLANA}"`],
  [src.includes(`"${EXPECTED_BASE}"`), `PROPZ_FEE_BASE must be exactly "${EXPECTED_BASE}"`],
  [src.includes(EXPECTED_BPS_LITERAL), `FEE_BPS must be exactly ${EXPECTED_BPS_LITERAL} (0.08%)`],
];

const failed = checks.filter(([ok]) => !ok);

if (failed.length) {
  console.error("\n  FEE WALLET INTEGRITY CHECK FAILED — refusing to build:\n");
  for (const [, msg] of failed) console.error("    - " + msg);
  console.error(
    `\n  ${FEE_FILE} does not match the expected platform fee wallets/rate.` +
    `\n  If this change is intentional, update EXPECTED_* in` +
    `\n  scripts/verify-fee-wallets.js to match — that's the deliberate part.\n`,
  );
  process.exit(1);
}

console.log(
  `  fee wallets: verified intact (0.08% -> sol:${EXPECTED_SOLANA.slice(0, 8)}... ` +
  `base:${EXPECTED_BASE.slice(0, 8)}...)`,
);
