// Runs on every page. Only job: tell the background worker this tab
// exists and needs checking. All the actual work (network lookup, deciding
// whether to show anything, injecting the widget) happens in
// background.js — a plain <script src> tag inserted from here gets blocked
// outright by any page with a strict Content-Security-Policy (confirmed:
// real pages do this), so the injection itself has to go through
// chrome.scripting.executeScript, which only the background worker can call.
(function () {
  if (window.__propzExtensionChecked) return;
  window.__propzExtensionChecked = true;

  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) return;
  chrome.runtime.sendMessage({ type: "propz:check" });
})();
