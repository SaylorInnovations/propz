// URL registrations for the Propz browser extension. A creator ties their
// tip jar to a specific page — their own GoFundMe campaign, a stream page,
// anywhere — without editing that page's HTML at all, which matters because
// most platforms creators actually use (GoFundMe very much included) don't
// let them edit it anyway. Registrations live in the PROPZ_PAGES KV
// namespace, keyed by a normalized URL, and are visible to every visitor
// with the extension installed — not just the person who registered it.
//
// There is no account system anywhere in Propz (by design — no signup,
// ever), so there is no concept of "owns this registration" beyond
// possessing its editToken. Registering a URL that's already taken without
// the right token is rejected, but nothing stops someone who has never seen
// the page from registering it first. Fine for now — this ships for a
// handful of people who know each other — but worth remembering before this
// scales past that.

export type PageRegistration = {
  name: string;
  message: string;
  button: string;
  solana: string;
  base: string;
  accent: string;
  editToken: string;
  registeredAt: string;
};

// Strips the query string, hash, and any trailing slash, and lowercases the
// host, so ?utm_source=... variants and case differences don't silently
// fragment one page into several registrations.
export function normalizePageUrl(raw: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  const path = parsed.pathname.replace(/\/+$/, "") || "/";
  // parsed.host (not hostname) — hostname silently drops a non-default
  // port, which would collide two different sites on the same host.
  return `${parsed.protocol}//${parsed.host.toLowerCase()}${path}`;
}

export function pageKey(normalizedUrl: string): string {
  return `page:${normalizedUrl}`;
}
