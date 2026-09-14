export const ORIGIN = "https://propz.saylorinnovations.com";
export const DEFAULTS = { sol: "", base: "", name: "", message: "", button: "Send Propz", accent: "cyan" };
export const ACCENTS = ["cyan", "green", "amber", "violet"];

export function validationError(cfg) {
  if (!cfg.sol && !cfg.base) return "Add a public Solana or Base receiving address.";
  if (cfg.sol && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cfg.sol)) return "Check your Solana public address.";
  if (cfg.base && !/^0x[a-fA-F0-9]{40}$/.test(cfg.base)) return "Check your Base public address (0x followed by 40 hexadecimal characters).";
  return "";
}

export function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function publishOutputs(cfg) {
  if (validationError(cfg)) return null;
  const params = new URLSearchParams();
  Object.keys(DEFAULTS).forEach((key) => {
    if (cfg[key]) params.set(key, cfg[key]);
  });
  const link = ORIGIN + "/jar?" + params.toString();
  const embedUrl = ORIGIN + "/embed?" + params.toString();
  const attrs = Array.from(params, ([key, value]) => `data-${key}="${escapeAttr(value)}"`).join(" ");
  return {
    link,
    widget: `<script src="${ORIGIN}/widget.js" ${attrs} async></script>`,
    embed: `<iframe src="${escapeAttr(embedUrl)}" title="${escapeAttr("Send Propz to " + (cfg.name || "creator"))}" width="100%" height="520" style="border:0;max-width:440px" loading="lazy" referrerpolicy="no-referrer"></iframe>`,
  };
}
