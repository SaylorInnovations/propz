// Short, memorable Propz links — propz.saylorinnovations.com/@handle — so a
// creator has something worth pasting into a Linktree, an Instagram/TikTok/X
// bio, or a YouTube description instead of a long query-string URL with their
// raw wallet address sitting in it (still public info either way, but it
// reads as unpolished and isn't something a non-technical supporter would
// trust tapping). Registrations live in the same PROPZ_PAGES KV namespace the
// browser extension's page registrations use (see app/lib/pages.ts), just
// under a different key prefix — one namespace, two independent uses.
//
// No accounts anywhere in Propz (see pages.ts for the reasoning) — possession
// of the editToken returned from the first successful registration is what
// lets a creator update or release their own handle later. The client is
// expected to keep it in localStorage; it never round-trips into a URL
// anyone else would see.

import type { Accent, TipConfig } from "./tip";

export type HandleRegistration = {
  handle: string;
  name: string;
  message: string;
  button: string;
  solana: string;
  base: string;
  accent: Accent;
  editToken: string;
  registeredAt: string;
  updatedAt: string;
};

// Every real top-level route this app serves, plus a few obvious traps, so a
// handle can never shadow (or be permanently unreachable behind) a real page.
const RESERVED = new Set([
  "api",
  "jar",
  "embed",
  "studio",
  "extension",
  "widget.js",
  "og.png",
  "favicon.svg",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "well-known",
  ".well-known",
  "manifest",
  "app",
  "assets",
  "static",
  "_next",
  "admin",
  "help",
  "support",
  "about",
  "contact",
  "terms",
  "privacy",
  "propz",
  "null",
  "undefined",
]);

// 2–32 chars, must start and end alphanumeric, "_" and "-" allowed in the
// middle — readable as a handle, safe in a URL path with no encoding, and
// impossible to confuse with a file extension or query string.
const HANDLE_RE = /^[a-z0-9](?:[a-z0-9_-]{0,30}[a-z0-9])?$/;

// Accepts the "@dave" people will actually type (it's how every social
// platform this is meant to sit next to formats a handle) as well as the
// bare "dave" the API and KV key store internally. Also decodes a
// percent-encoded "@" (%40) first — the [handle] dynamic route segment for
// a request like /@dave hands this function "%40dave", not "@dave", since
// the "@" arrives already percent-encoded by the time it reaches params.
export function normalizeHandle(raw: string): string | null {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // Malformed escape sequence — fall through and validate the raw string,
    // which will simply fail HANDLE_RE below.
  }
  const stripped = decoded.trim().replace(/^@+/, "").toLowerCase();
  if (stripped.length < 2 || stripped.length > 32) return null;
  if (!HANDLE_RE.test(stripped)) return null;
  if (RESERVED.has(stripped)) return null;
  return stripped;
}

export function handleKey(handle: string): string {
  return `handle:${handle}`;
}

export function handleToConfig(record: HandleRegistration): TipConfig {
  return {
    name: record.name,
    message: record.message,
    button: record.button,
    solana: record.solana,
    base: record.base,
    accent: record.accent,
  };
}
