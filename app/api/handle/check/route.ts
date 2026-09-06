import { normalizeHandle } from "../../../lib/handles";
import { getHandleRegistration } from "../../../lib/handle-store";

// Live availability check the Studio calls while someone types a handle.
// Public and unauthenticated on purpose, same as every other Propz endpoint
// — it only ever answers "yes/no", never returns the registration itself.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("handle") || "";
  const handle = normalizeHandle(raw);
  if (!handle) return json({ available: false, reason: "invalid" });

  const existing = await getHandleRegistration(handle);
  if (!existing) return json({ available: true, handle });

  // Not taken by *you* necessarily — the Studio only knows that once it has
  // tried registering with whatever editToken it has stored locally for this
  // handle. This just tells the typing UI whether to show a green check.
  return json({ available: false, reason: "taken", handle });
}
