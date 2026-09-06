// Mirrors app/lib/tip.ts's validSolanaAddress / validEvmAddress exactly.
// Duplicated here (not imported) because this extension has no build step —
// keep any change to either address format in sync with the main app by hand.
function validSolanaAddress(value) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test((value || "").trim());
}
function validEvmAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test((value || "").trim());
}
