// Server-only KV access for handle registrations. Kept separate from
// app/lib/handles.ts (which stays import-safe for the client-side Studio
// component) because this file touches the cloudflare:workers binding.
//
// That binding is imported dynamically, inside handleKv(), rather than as a
// static top-level import: /jar, /embed, /api/qr, and /api/manifest all now
// route through resolveConfig() below even for requests with no handle at
// all, and a static `import ... from "cloudflare:workers"` is resolved the
// moment this module loads — which happens for every request through those
// routes, not just handle ones, and breaks tooling (this repo's own
// tests/rendered-html.test.mjs included) that runs the built worker under
// plain Node instead of workerd. A dynamic import here is only ever reached
// when a request actually resolves a handle, so everything else is unaffected.
import { readConfig, type TipConfig } from "./tip";
import { normalizeHandle, handleKey, handleToConfig, type HandleRegistration } from "./handles";

export async function handleKv(): Promise<KVNamespace | null> {
  try {
    const { env } = await import("cloudflare:workers");
    return (env as unknown as { PROPZ_PAGES?: KVNamespace }).PROPZ_PAGES ?? null;
  } catch {
    return null;
  }
}

export async function getHandleRegistration(handle: string): Promise<HandleRegistration | null> {
  const store = await handleKv();
  if (!store) return null;
  const raw = await store.get(handleKey(handle));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HandleRegistration;
  } catch {
    return null;
  }
}

export async function getHandleConfig(handle: string): Promise<TipConfig | null> {
  const record = await getHandleRegistration(handle);
  return record ? handleToConfig(record) : null;
}

type ParamValue = string | string[] | undefined;

// Shared by /jar, /embed, /api/qr, and /api/manifest: a request built with
// ?h=handle (or ?handle=handle) resolves the creator's claimed config from
// KV; anything else falls back to the existing raw sol/name/message/...
// query params, unchanged, so every link ever generated before handles
// existed keeps working exactly as it did.
export async function resolveConfig(params: Record<string, ParamValue>): Promise<TipConfig> {
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const handle = normalizeHandle(one("h") || one("handle") || "");
  if (handle) {
    const resolved = await getHandleConfig(handle);
    if (resolved) return resolved;
  }
  return readConfig(params);
}
