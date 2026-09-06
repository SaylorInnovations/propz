import QRCode from "qrcode";
import { basePayUri, solanaPayUrl, validEvmAddress, validSolanaAddress } from "../../lib/tip";
import { resolveConfig } from "../../lib/handle-store";

// A static, downloadable QR code for surfaces that can't run an iframe or JS:
// pre-recorded video overlays, video descriptions, printed material, thumbnails.
// The encoded payment URI never changes for a given wallet + amount, so this
// image can be exported once and reused indefinitely.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw: Record<string, string> = {};
  url.searchParams.forEach((value, key) => { raw[key] = value; });
  const config = await resolveConfig(raw);

  const amount = (raw.amount || "5").slice(0, 12);
  const numericAmount = Number(amount);
  if (!(numericAmount > 0) || !Number.isFinite(numericAmount)) {
    return Response.json({ error: "amount must be a positive number" }, { status: 400 });
  }

  const chain = raw.chain === "base" ? "base" : raw.chain === "sol" ? "sol" : "";
  const solReady = validSolanaAddress(config.solana);
  const baseReady = validEvmAddress(config.base);
  const useBase = chain === "base" ? baseReady : chain === "sol" ? false : !solReady && baseReady;

  let paymentUri = "";
  if (useBase && baseReady) {
    paymentUri = basePayUri(config.base, amount);
  } else if (solReady) {
    const asset = raw.asset === "sol" ? "SOL" : "USDC";
    paymentUri = solanaPayUrl(config.solana, amount, asset, config.name, url.origin);
  }

  if (!paymentUri) {
    return Response.json({ error: "add a valid sol or base wallet address first" }, { status: 400 });
  }

  const size = Math.min(2000, Math.max(128, Number(raw.size) || 640));
  const buffer = await QRCode.toBuffer(paymentUri, {
    width: size,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#071114", light: "#ffffff" },
  });

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
      "Content-Disposition": `inline; filename="propz-${config.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "qr"}.png"`,
    },
  });
}
