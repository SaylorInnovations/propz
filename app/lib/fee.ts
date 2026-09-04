// The Propz platform fee: a small, disclosed cut sent alongside every tip
// so the product can stay funded. It comes OUT of the amount the supporter
// picks (they still see and approve one total) — Propz never asks for more
// than the number shown on the button. The creator gets the rest, and the
// split happens inside the same wallet-signed transfer(s) the supporter
// authorizes, so Propz's own code never holds or custodies the funds.
export const FEE_BPS = BigInt(8); // 0.08% = 8 basis points (1 basis point = 0.01%)
export const FEE_PERCENT_LABEL = "0.08%";

const BPS_DENOMINATOR = BigInt(10_000);

export const PROPZ_FEE_SOLANA = "341CaU9NT2PJftYakDsrchSK3PatVuo4yvzDA7zQbh65";
export const PROPZ_FEE_BASE = "0x66d24018F3c8e5e5C4E703C8e378D3E7Df3D9C74";

/**
 * Splits a whole amount already converted to its smallest on-chain unit
 * (lamports, or 6-decimal USDC units) into what the creator receives and
 * what the Propz fee wallet receives. The fee always rounds down, so on
 * very small tips it can land at 0 — callers should skip building a
 * fee transfer/instruction in that case rather than send a zero-amount one.
 */
export function splitUnits(totalUnits: bigint): { creatorUnits: bigint; feeUnits: bigint } {
  if (totalUnits <= BigInt(0)) return { creatorUnits: BigInt(0), feeUnits: BigInt(0) };
  const feeUnits = (totalUnits * FEE_BPS) / BPS_DENOMINATOR;
  return { creatorUnits: totalUnits - feeUnits, feeUnits };
}
