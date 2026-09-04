import { FEE_BPS, PROPZ_FEE_BASE, PROPZ_FEE_SOLANA } from "../../lib/fee";
import { BASE_USDC, readConfig, SOLANA_USDC, validEvmAddress, validSolanaAddress } from "../../lib/tip";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw: Record<string, string> = {};
  url.searchParams.forEach((value, key) => { raw[key] = value; });
  const config = readConfig(raw);
  const payments: Record<string, string | number>[] = [];

  if (validSolanaAddress(config.solana)) {
    // A static "recipient+amount" link can only ever describe one payee.
    // Propz settles to two (creator + the disclosed fee wallet below), so
    // the real payment link is a Solana Pay transaction-request endpoint:
    // POST { account } to it and it returns an unsigned transaction with
    // both transfers already split out.
    const solTemplate = (asset: "SOL" | "USDC") =>
      `solana:${url.origin}/api/pay/solana?recipient=${config.solana}&amount={amount}&asset=${asset}&label=${encodeURIComponent(config.name)}`;
    payments.push(
      { network: "solana:mainnet", asset: "SOL", recipient: config.solana, decimals: 9, paymentScheme: "solana-pay-transaction-request", paymentUriTemplate: solTemplate("SOL"), feeBps: Number(FEE_BPS), feeRecipient: PROPZ_FEE_SOLANA },
      { network: "solana:mainnet", asset: "USDC", token: SOLANA_USDC, recipient: config.solana, decimals: 6, paymentScheme: "solana-pay-transaction-request", paymentUriTemplate: solTemplate("USDC"), feeBps: Number(FEE_BPS), feeRecipient: PROPZ_FEE_SOLANA },
    );
  }
  if (validEvmAddress(config.base)) {
    // No single-signature way to split an EVM transfer without a router
    // contract, so today this template covers only the recipient's cut;
    // the fee rides as a second sequential transfer to feeRecipient.
    payments.push({ network: "eip155:8453", asset: "USDC", token: BASE_USDC, recipient: config.base, decimals: 6, paymentScheme: "eip-681-sequential", paymentUriTemplate: `ethereum:${BASE_USDC}@8453/transfer?address=${config.base}&uint256={baseUnits}`, feeBps: Number(FEE_BPS), feeRecipient: PROPZ_FEE_BASE });
  }

  return Response.json(
    {
      protocol: "propz/1",
      recipient: config.name,
      message: config.message,
      noncustodial: true,
      platformFeeBps: Number(FEE_BPS),
      humanUrl: `${url.origin}/jar${url.search}`,
      suggestedAmounts: [1, 5, 10, 25],
      payments,
      generatedAt: new Date().toISOString(),
    },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=300" } },
  );
}
