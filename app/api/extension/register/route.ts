import { env } from "cloudflare:workers";
import { readConfig, validEvmAddress, validSolanaAddress } from "../../../lib/tip";
import { normalizePageUrl, pageKey, type PageRegistration } from "../../../lib/pages";

// Backs the browser extension's "keep it on this page" / "revert" toggle.
// POST creates or updates a page's registration; DELETE removes it ("revert").
// No accounts anywhere in Propz, so possession of the editToken returned
// from the first POST is the only thing standing between someone and
// re-registering or deleting a page they don't own — see app/lib/pages.ts
// for the tradeoff that accepts.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: CORS_HEADERS });
}

function kv(): KVNamespace | null {
  return (env as unknown as { PROPZ_PAGES?: KVNamespace }).PROPZ_PAGES ?? null;
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

type RegisterBody = {
  url?: string;
  name?: string;
  message?: string;
  button?: string;
  sol?: string;
  base?: string;
  accent?: string;
  editToken?: string;
};

export async function POST(request: Request) {
  const store = kv();
  if (!store) return json({ error: "page registration is not configured on this deployment" }, 503);

  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return json({ error: "invalid request body" }, 400);
  }

  const normalized = body.url ? normalizePageUrl(body.url) : null;
  if (!normalized) return json({ error: "invalid or missing url" }, 400);

  const config = readConfig({
    name: body.name,
    message: body.message,
    button: body.button,
    sol: body.sol,
    base: body.base,
    accent: body.accent,
  });

  const solOk = Boolean(config.solana) && validSolanaAddress(config.solana);
  const baseOk = Boolean(config.base) && validEvmAddress(config.base);
  if (!solOk && !baseOk) {
    return json({ error: "a valid Solana or Base receiving address is required" }, 400);
  }

  const key = pageKey(normalized);
  const existingRaw = await store.get(key);
  let editToken = crypto.randomUUID();

  if (existingRaw) {
    const existing = JSON.parse(existingRaw) as PageRegistration;
    if (!body.editToken || body.editToken !== existing.editToken) {
      return json({ error: "this page is already registered under a different edit token" }, 403);
    }
    editToken = existing.editToken;
  }

  const record: PageRegistration = {
    name: config.name,
    message: config.message,
    button: config.button,
    solana: solOk ? config.solana : "",
    base: baseOk ? config.base : "",
    accent: config.accent,
    editToken,
    registeredAt: new Date().toISOString(),
  };

  await store.put(key, JSON.stringify(record));

  return json({ ok: true, url: normalized, editToken });
}

export async function DELETE(request: Request) {
  const store = kv();
  if (!store) return json({ error: "page registration is not configured on this deployment" }, 503);

  let body: { url?: string; editToken?: string };
  try {
    body = (await request.json()) as { url?: string; editToken?: string };
  } catch {
    return json({ error: "invalid request body" }, 400);
  }

  const normalized = body.url ? normalizePageUrl(body.url) : null;
  if (!normalized) return json({ error: "invalid or missing url" }, 400);

  const key = pageKey(normalized);
  const existingRaw = await store.get(key);
  if (!existingRaw) return json({ ok: true, alreadyGone: true });

  const existing = JSON.parse(existingRaw) as PageRegistration;
  if (!body.editToken || body.editToken !== existing.editToken) {
    return json({ error: "wrong edit token for this page" }, 403);
  }

  await store.delete(key);
  return json({ ok: true });
}
