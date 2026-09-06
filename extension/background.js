// Service worker — the only place in this extension that talks to the
// network or touches a page's DOM. Content scripts run inside page
// contexts, where a page's own CSP can block both fetch() and a plain
// <script src> injection (confirmed against a real strict-CSP page); the
// background worker calls chrome.scripting.executeScript instead, which is
// exempt from the page's CSP by design — that's what the API is for.

const API_ORIGIN = "https://propz.saylorinnovations.com";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: chrome.runtime.getURL("onboarding.html") });
  }
});

// Mirrors app/lib/pages.ts's normalizePageUrl (also duplicated in popup.js)
// — used here purely as a local cache key, so a query-string or hash-only
// change on an already-registered page doesn't tear down and rebuild the
// widget for no reason.
function normalizeUrl(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const path = u.pathname.replace(/\/+$/, "") || "/";
  return `${u.protocol}//${u.host.toLowerCase()}${path}`;
}

async function lookup(url) {
  try {
    const res = await fetch(`${API_ORIGIN}/api/extension/lookup?url=${encodeURIComponent(url)}`);
    if (!res.ok) return { registered: false };
    return await res.json();
  } catch {
    return { registered: false };
  }
}

async function register(payload) {
  try {
    const res = await fetch(`${API_ORIGIN}/api/extension/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: String(err) } };
  }
}

async function revert(url, editToken) {
  try {
    const res = await fetch(`${API_ORIGIN}/api/extension/register`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, editToken }),
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: String(err) } };
  }
}

// Runs inside the PAGE's own main-world JS context via
// chrome.scripting.executeScript — cannot reference anything from this
// file's closure. Deliberately the same design as public/widget.js (Shadow
// DOM, fixed-position fab, toggling panel with an iframe pointing at
// /embed) but re-declared standalone, since executeScript's `func` has to
// be fully self-contained. Keep the two in sync by hand if either changes.
//
// Re-run on every navigation the background worker notices — including
// same-document SPA navigation (see the webNavigation.onHistoryStateUpdated
// listener below), which is how almost every social platform this is meant
// to run on actually changes pages. `pageKey` is the normalized URL the
// background worker last looked up; `config` is null when that URL isn't
// registered. window.__propzWidgetState remembers what's currently mounted
// so navigating between two pages inside the same SPA document tears down
// the old page's widget and/or mounts the new one, instead of either
// leaking a stale button onto an unrelated page or silently doing nothing.
function syncPropzWidget(pageKey, config, apiOrigin) {
  const state = window.__propzWidgetState;

  if (!config) {
    if (state) {
      state.host.remove();
      window.__propzWidgetState = null;
    }
    return;
  }

  if (state && state.pageKey === pageKey) return; // already showing the right thing

  if (state) state.host.remove();

  const params = new URLSearchParams();
  if (config.sol) params.set("sol", config.sol);
  if (config.base) params.set("base", config.base);
  if (config.name) params.set("name", config.name);
  if (config.message) params.set("message", config.message);
  if (config.button) params.set("button", config.button);
  if (config.accent) params.set("accent", config.accent);
  const embedUrl = `${apiOrigin}/embed?${params.toString()}`;
  const label = config.button || "Send Propz";

  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent =
    ':host{all:initial}' +
    '*{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '.fab{position:fixed;bottom:20px;right:20px;z-index:2147483000;display:inline-flex;' +
      'align-items:center;gap:8px;padding:13px 20px;border-radius:999px;border:1px solid rgba(24,223,242,.35);' +
      'background:#030a17;color:#f8fbff;box-shadow:0 10px 30px rgba(0,0,0,.4);cursor:pointer;' +
      'font-weight:600;font-size:14px;line-height:1;transition:transform .15s ease,box-shadow .15s ease}' +
    '.fab:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(0,0,0,.45)}' +
    '.fab svg{width:16px;height:16px;flex:none}' +
    '.panel{position:fixed;bottom:86px;right:20px;z-index:2147483000;width:340px;max-width:calc(100vw - 32px);' +
      'border-radius:18px;overflow:hidden;background:#030a17;border:1px solid rgba(24,223,242,.25);' +
      'box-shadow:0 24px 60px rgba(0,0,0,.55);transform:translateY(10px) scale(.98);opacity:0;' +
      'pointer-events:none;transition:transform .18s ease,opacity .18s ease}' +
    '.panel.open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}' +
    '.panel iframe{display:block;width:100%;height:520px;max-height:min(520px,calc(100vh - 150px));border:0}' +
    '.close{position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;' +
      'background:rgba(255,255,255,.08);color:#c7cbd4;border:none;cursor:pointer;font-size:15px;line-height:1;' +
      'display:flex;align-items:center;justify-content:center}' +
    '.close:hover{background:rgba(255,255,255,.16)}' +
    '@media (max-width:480px){.panel{right:16px;bottom:80px;width:calc(100vw - 32px)}.fab{right:16px;bottom:16px}}';
  root.appendChild(style);

  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "fab";
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-label", label);
  fab.innerHTML =
    '<svg viewBox="0 0 48 48" fill="none" stroke="#18dff2" stroke-width="4.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M9 40V9h16c9.1 0 15 5.3 15 13.5S34.1 36 25 36H18"/>' +
    '<path d="M15 31V16h10c4.5 0 7.5 2.5 7.5 6.5S29.5 29 25 29h-4"/>' +
    '<circle cx="40" cy="9" r="2.8" fill="#18dff2" stroke="none"/>' +
    '<circle cx="9" cy="40" r="2.8" fill="#18dff2" stroke="none"/>' +
    '<circle cx="21" cy="29" r="2.3" fill="#18dff2" stroke="none"/></svg>' +
    "<span>" + label.replace(/</g, "&lt;") + "</span>";
  root.appendChild(fab);

  const panel = document.createElement("div");
  panel.className = "panel";
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "✕";
  const iframe = document.createElement("iframe");
  iframe.title = "Propz tip jar";
  iframe.loading = "lazy";
  panel.appendChild(closeBtn);
  panel.appendChild(iframe);
  root.appendChild(panel);

  let open = false;
  function setOpen(next) {
    open = next;
    panel.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", String(open));
    if (open && !iframe.src) iframe.src = embedUrl;
  }
  fab.addEventListener("click", () => setOpen(!open));
  closeBtn.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setOpen(false);
  });

  window.__propzWidgetState = { pageKey, host };
}

async function checkAndMount(tabId, url) {
  const pageKey = normalizeUrl(url);
  if (!pageKey) return;
  const result = await lookup(url);
  const config =
    result && result.registered
      ? {
          sol: result.sol,
          base: result.base,
          name: result.name,
          message: result.message,
          button: result.button,
          accent: result.accent,
        }
      : null;
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: syncPropzWidget,
      args: [pageKey, config, API_ORIGIN],
    });
  } catch {
    // Page disallows script injection entirely (some browser-internal
    // pages do) — nothing to do about that, just skip it.
  }
}

// Content scripts only run once per real document load, which misses the
// dominant navigation pattern on the platforms this extension targets:
// Twitter/X, Instagram, YouTube, TikTok, Facebook and friends all route
// internally via the History API, never firing a new document load when a
// visitor moves from one profile/page to another. Without this, the widget
// would only ever appear after a manual hard refresh of an exact registered
// URL — not good enough for "overlay this on my social page." A short
// per-tab debounce collapses the handful of history events a single visual
// navigation can fire on some sites into one lookup.
const navDebounce = new Map();
function scheduleCheck(tabId, url) {
  clearTimeout(navDebounce.get(tabId));
  navDebounce.set(
    tabId,
    setTimeout(() => {
      navDebounce.delete(tabId);
      checkAndMount(tabId, url);
    }, 150),
  );
}
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId !== 0) return; // top frame only, same as content_scripts
  scheduleCheck(details.tabId, details.url);
});
chrome.tabs.onRemoved.addListener((tabId) => {
  clearTimeout(navDebounce.get(tabId));
  navDebounce.delete(tabId);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "propz:check") {
    if (sender.tab?.id != null && sender.tab.url) {
      checkAndMount(sender.tab.id, sender.tab.url);
    }
    return false;
  }
  if (message?.type === "propz:lookup") {
    lookup(message.url).then(sendResponse);
    return true;
  }
  if (message?.type === "propz:register") {
    register(message.payload).then((res) => {
      if (res.status < 300 && message.tabId != null) checkAndMount(message.tabId, message.payload?.url);
      sendResponse(res);
    });
    return true;
  }
  if (message?.type === "propz:revert") {
    revert(message.url, message.editToken).then((res) => {
      if (res.status < 300 && message.tabId != null) checkAndMount(message.tabId, message.url);
      sendResponse(res);
    });
    return true;
  }
  return false;
});
