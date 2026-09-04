import { env } from "cloudflare:workers";
import { normalizePageUrl, pageKey, type PageRegistration } from "../../../lib/pages";

// The browser extension's content script calls this on every page load to
// decide whether to show anything at all. Public and unauthenticated by
// design — this is what makes the tip button visible to a page's actual
// visitors, not just the person who registered it.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200, cache = false) {
  return Response.json(data, {
    status,
    headers: cache
      ? { ...CORS_HEADERS, "Cache-Control": "public, max-age=120" }
      : CORS_HEADERS,
  });
}

function kv(): KVNamespace | null {
  return (env as unknown as { PROPZ_PAGES?: KVNamespace }).PROPZ_PAGES ?? null;
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const store = kv();
  if (!store) return json({ registered: false }, 200);

  const url = new URL(request.url);
  const target = url.searchParams.get("url") || "";
  const normalized = normalizePageUrl(target);
  if (!normalized) return json({ error: "invalid or missing url" }, 400);

  const raw = await store.get(pageKey(normalized));
  if (!raw) return json({ registered: false }, 200, true);

  const record = JSON.parse(raw) as PageRegistration;
  // editToken never leaves the server past this point — it's the
  // registrant's credential, not something every visitor's browser needs.
  return json(
    {
      registered: true,
      name: record.name,
      message: record.message,
      button: record.button,
      sol: record.solana,
      base: record.base,
      accent: record.accent,
    },
    200,
    true,
  );
}
