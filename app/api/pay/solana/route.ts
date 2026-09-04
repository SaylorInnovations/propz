import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { PROPZ_FEE_SOLANA, splitUnits } from "../../../lib/fee";
import { SOLANA_USDC, validSolanaAddress } from "../../../lib/tip";

// A Solana Pay "transaction request" endpoint (SIMD-approved spec wallets
// like Phantom and Solflare already understand): GET describes the request,
// POST takes the payer's pubkey and returns an unsigned transaction for
// them to sign. Propz never holds a private key here and never touches the
// funds — it only writes down, inside the transaction the supporter signs,
// that most of it goes to the creator and a disclosed 0.08% goes to the
// Propz fee wallet.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: CORS_HEADERS });
}

function rpcUrl() {
  // Set SOLANA_RPC_URL in production (e.g. a paid Helius endpoint) — the
  // public cluster URL is fine for local testing but rate-limits quickly.
  return process.env.SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const label = (url.searchParams.get("label") || "Propz").slice(0, 48);
  return json({
    label: `Send Propz to ${label}`,
    icon: `${url.origin}/propz-logo.png`,
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const recipient = url.searchParams.get("recipient") || "";
  const asset = url.searchParams.get("asset") === "SOL" ? "SOL" : "USDC";
  const label = (url.searchParams.get("label") || "Propz").slice(0, 48);
  const amount = Number(url.searchParams.get("amount") || "");

  if (!validSolanaAddress(recipient)) {
    return json({ error: "invalid recipient address" }, 400);
  }
  if (!(amount > 0) || !Number.isFinite(amount) || amount > 1_000_000) {
    return json({ error: "invalid amount" }, 400);
  }

  let body: { account?: string };
  try {
    body = (await request.json()) as { account?: string };
  } catch {
    return json({ error: "invalid request body" }, 400);
  }
  if (!body.account || !validSolanaAddress(body.account)) {
    return json({ error: "missing or invalid payer account" }, 400);
  }

  let payer: PublicKey, creator: PublicKey, feeWallet: PublicKey;
  try {
    payer = new PublicKey(body.account);
    creator = new PublicKey(recipient);
    feeWallet = new PublicKey(PROPZ_FEE_SOLANA);
  } catch {
    return json({ error: "invalid public key" }, 400);
  }

  const decimals = asset === "SOL" ? 9 : 6;
  const totalUnits = BigInt(Math.round(amount * 10 ** decimals));
  const { creatorUnits, feeUnits } = splitUnits(totalUnits);

  const transaction = new Transaction();

  try {
    if (asset === "SOL") {
      transaction.add(SystemProgram.transfer({ fromPubkey: payer, toPubkey: creator, lamports: creatorUnits }));
      if (feeUnits > BigInt(0)) {
        transaction.add(SystemProgram.transfer({ fromPubkey: payer, toPubkey: feeWallet, lamports: feeUnits }));
      }
    } else {
      const mint = new PublicKey(SOLANA_USDC);
      const payerAta = await getAssociatedTokenAddress(mint, payer);
      const creatorAta = await getAssociatedTokenAddress(mint, creator);
      const feeAta = await getAssociatedTokenAddress(mint, feeWallet);

      // Idempotent creates: cheap no-ops if the recipient already has a
      // USDC token account, and the supporter (payer) covers the small
      // rent-exempt cost the first time either recipient doesn't.
      transaction.add(
        createAssociatedTokenAccountIdempotentInstruction(payer, creatorAta, creator, mint),
        createTransferCheckedInstruction(payerAta, mint, creatorAta, payer, creatorUnits, decimals),
      );
      if (feeUnits > BigInt(0)) {
        transaction.add(
          createAssociatedTokenAccountIdempotentInstruction(payer, feeAta, feeWallet, mint),
          createTransferCheckedInstruction(payerAta, mint, feeAta, payer, feeUnits, decimals),
        );
      }
    }

    const connection = new Connection(rpcUrl(), "confirmed");
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    const serialized = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });

    return json({
      transaction: serialized.toString("base64"),
      message:
        feeUnits > BigInt(0)
          ? `Propz for ${label} — includes a 0.08% Propz platform fee`
          : `Propz for ${label}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not build the transaction.";
    return json({ error: message }, 502);
  }
}
