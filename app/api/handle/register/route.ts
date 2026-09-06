import { readConfig, validEvmAddress, validSolanaAddress } from "../../../lib/tip";
import { normalizeHandle, handleKey, type HandleRegistration } from "../../../lib/handles";
import { handleKv, getHandleRegistration } from "../../../lib/handle-store";

// Claims or updates a short propz.saylorinnovations.com/@handle link. POST
// creates or updates; DELETE releases it. Same no-accounts tradeoff as the
// extension's page registration (app/api/extension/register) — possession of
// the editToken returned from the first POST is the only thing standing
// between someone and re-registering or deleting a handle they don't own.
// Fine for what this is; worth remembering before it scales past that.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

type RegisterBody = {
  handle?: string;
  name?: string;
  message?: string;
  button?: string;
  sol?: string;
  base?: string;
  accent?: string;
  editToken?: string;
};

export async function POST(request: Request) {
  const store = await handleKv();
  if (!store) return json({ error: "handle registration is not configured on this deployment" }, 503);

  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return json({ error: "invalid request body" }, 400);
  }

  const handle = body.handle ? normalizeHandle(body.handle) : null;
  if (!handle) return json({ error: "invalid or missing handle" }, 400);

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

  const key = handleKey(handle);
  const existing = await getHandleRegistration(handle);
  let editToken = crypto.randomUUID();

  if (existing) {
    if (!body.editToken || body.editToken !== existing.editToken) {
      return json({ error: "this handle is already taken" }, 409);
    }
    editToken = existing.editToken;
  }

  const record: HandleRegistration = {
    handle,
    name: config.name,
    message: config.message,
    button: config.button,
    solana: solOk ? config.solana : "",
    base: baseOk ? config.base : "",
    accent: config.accent,
    editToken,
    registeredAt: existing?.registeredAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await store.put(key, JSON.stringify(record));

  return json({ ok: true, handle, editToken });
}

export async function DELETE(request: Request) {
  const store = await handleKv();
  if (!store) return json({ error: "handle registration is not configured on this deployment" }, 503);

  let body: { handle?: string; editToken?: string };
  try {
    body = (await request.json()) as { handle?: string; editToken?: string };
  } catch {
    return json({ error: "invalid request body" }, 400);
  }

  const handle = body.handle ? normalizeHandle(body.handle) : null;
  if (!handle) return json({ error: "invalid or missing handle" }, 400);

  const existing = await getHandleRegistration(handle);
  if (!existing) return json({ ok: true, alreadyGone: true });

  if (!body.editToken || body.editToken !== existing.editToken) {
    return json({ error: "wrong edit token for this handle" }, 403);
  }

  await store.delete(handleKey(handle));
  return json({ ok: true });
}
