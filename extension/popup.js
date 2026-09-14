import { ACCENTS, DEFAULTS, publishOutputs, validationError } from "./publish.js";

const form = document.getElementById("form");
const hint = document.getElementById("hint");
const format = document.getElementById("format");
const output = document.getElementById("output");
const copyButton = document.getElementById("copy");
const preview = document.getElementById("preview");
const swatches = document.getElementById("swatches");
let accent = DEFAULTS.accent;
let edited = false;
const instructions = {
  widget: "Paste into your website’s custom code or footer before </body>, then publish. Visitors see a floating tip button. Your site must allow scripts.",
  embed: "Paste into a Custom HTML or Embed block where the card should appear, then publish. Your site must allow iframes.",
  link: "Paste this link in your bio, video description, post, or newsletter. Use it when the platform does not allow embed code.",
};
function config() {
  return Object.fromEntries(Object.keys(DEFAULTS).map((key) => [key, key === "accent" ? accent : document.getElementById(key).value.trim()]));
}
function status(message, error = false) {
  hint.textContent = message;
  hint.className = "hint " + (error ? "error" : "ok");
}
function setAccent(value) {
  accent = ACCENTS.includes(value) ? value : "cyan";
  for (const button of swatches.children) {
    const selected = button.dataset.accent === accent;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
}
function render() {
  const outputs = publishOutputs(config());
  output.value = outputs ? outputs[format.value] : "";
  copyButton.disabled = !outputs;
  copyButton.textContent = format.value === "link" ? "Copy link" : "Copy code";
  preview.hidden = !outputs;
  if (outputs) preview.href = outputs.link;
  else preview.removeAttribute("href");
  document.getElementById("instructions").textContent = instructions[format.value];
}
chrome.storage.sync.get(DEFAULTS, (saved) => {
  if (chrome.runtime.lastError) {
    status("Could not load saved settings. You can still build and copy your jar.", true);
    return;
  }
  if (edited) return;
  for (const key of Object.keys(DEFAULTS)) {
    if (key !== "accent") document.getElementById(key).value = saved[key] || DEFAULTS[key];
  }
  setAccent(saved.accent);
  render();
});
form.addEventListener("input", () => { edited = true; status(""); render(); });
swatches.addEventListener("click", (event) => {
  const button = event.target.closest(".swatch");
  if (!button) return;
  edited = true;
  setAccent(button.dataset.accent);
  render();
});
format.addEventListener("change", render);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cfg = config();
  // Allow clearing all fields to remove saved receiving addresses.
  const error = (cfg.sol || cfg.base) ? validationError(cfg) : "";
  if (error) return status(error, true);
  chrome.storage.sync.set(cfg, () => {
    if (chrome.runtime.lastError) return status("Could not save settings. Please try again.", true);
    status("Settings saved. Copy your code or link below to publish your jar.");
    render();
  });
});
copyButton.addEventListener("click", async () => {
  render();
  if (copyButton.disabled) return;
  try {
    await navigator.clipboard.writeText(output.value);
    status("Copied. Paste it into your website or content, then publish there.");
  } catch {
    output.focus();
    output.select();
    status("Copy was blocked. Your code is selected; press Ctrl+C or Command+C.", true);
  }
});
setAccent(accent);
render();
