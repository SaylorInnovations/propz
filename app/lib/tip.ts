export const SOLANA_USDC = "EPjFWdd5AufqSSqeM2N1xzybapC8G4wEGGkZwyTDt1v";
export const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export type Accent = "cyan" | "green" | "amber" | "violet";

export type TipConfig = {
  name: string;
  message: string;
  button: string;
  solana: string;
  base: string;
  accent: Accent;
};

export const defaultConfig: TipConfig = {
  name: "Your name",
  message: "If this brought you value, send a little Propz directly onchain.",
  button: "Send Propz",
  solana: "",
  base: "",
  accent: "cyan",
};

type ParamValue = string | string[] | undefined;

export function readConfig(params: Record<string, ParamValue>): TipConfig {
  const one = (key: string, fallback: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.slice(0, 180) || fallback;
  };
  const accent = one("accent", defaultConfig.accent);

  return {
    name: one("name", defaultConfig.name),
    message: one("message", defaultConfig.message),
    button: one("button", defaultConfig.button),
    solana: one("sol", ""),
    base: one("base", ""),
    accent: ["cyan", "green", "amber", "violet"].includes(accent)
      ? (accent as Accent)
      : "cyan",
  };
}

export function configParams(config: TipConfig) {
  const params = new URLSearchParams();
  params.set("name", config.name.trim() || defaultConfig.name);
  params.set("message", config.message.trim() || defaultConfig.message);
  params.set("button", config.button.trim() || defaultConfig.button);
  if (config.solana.trim()) params.set("sol", config.solana.trim());
  if (config.base.trim()) params.set("base", config.base.trim());
  params.set("accent", config.accent);
  return params;
}

export function validSolanaAddress(value: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim());
}

export function validEvmAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function shortAddress(value: string) {
  if (value.length < 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-5)}`;
}

// Points at our own Solana Pay "transaction request" endpoint instead of a
// plain recipient+amount link. A static link can only ever describe one
// recipient, and every Propz payment now settles to two (the creator, plus
// the disclosed 0.08% Propz fee) — so wallets fetch this URL, POST their
// public key, and get back an unsigned transaction that carries both
// transfers for them to sign. `origin` must be an absolute origin (e.g.
// `https://propz.example`); pass "" only when no origin is known yet, which
// intentionally produces an unusable link rather than a relative one.
export function solanaPayUrl(
  recipient: string,
  amount: string,
  asset: "SOL" | "USDC",
  label: string,
  origin: string,
) {
  if (!origin) return "";
  const params = new URLSearchParams({
    recipient,
    amount,
    asset,
    label: label.slice(0, 48),
  });
  return `solana:${encodeURIComponent(`${origin}/api/pay/solana?${params.toString()}`)}`;
}

export function basePayUri(recipient: string, amount: string) {
  const units = BigInt(Math.round(Number(amount) * 1_000_000));
  return `ethereum:${BASE_USDC}@8453/transfer?address=${recipient}&uint256=${units}`;
}

// Custom URI schemes like `solana:` and injected-provider popups (window.ethereum)
// are frequently blocked by the restrictive webviews Propz gets embedded into
// (Instagram, TikTok, X, Linktree's own in-app browser). These https:// universal
// links reopen the current page inside the wallet's own browser, where the
// scheme/provider is guaranteed to work, so they act as a reliable fallback.
export function phantomBrowseUrl(targetUrl: string) {
  const ref = (() => {
    try {
      return new URL(targetUrl).origin;
    } catch {
      return "";
    }
  })();
  return `https://phantom.app/ul/browse/${encodeURIComponent(targetUrl)}?ref=${encodeURIComponent(ref)}`;
}

export function metamaskDeepLink(targetUrl: string) {
  return `https://metamask.app.link/dapp/${targetUrl.replace(/^https?:\/\//, "")}`;
}

export function coinbaseWalletDeepLink(targetUrl: string) {
  return `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(targetUrl)}`;
}

const IN_APP_BROWSERS: [RegExp, string][] = [
  [/Instagram/i, "Instagram"],
  [/FBAN|FBAV/i, "Facebook"],
  [/Twitter/i, "X"],
  [/Line\//i, "LINE"],
  [/TikTok|BytedanceWebview|musical_ly/i, "TikTok"],
  [/Linktree/i, "Linktree"],
];

export function inAppBrowserName(userAgent: string): string {
  const match = IN_APP_BROWSERS.find(([pattern]) => pattern.test(userAgent));
  return match?.[1] ?? "";
}
