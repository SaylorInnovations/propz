// Propz floating widget — the "add this to any page" equivalent of
// saylorinnovations.com's own floating "Free Consultation" button, but since
// Propz has nowhere on a third-party host page to scroll to, clicking it
// expands the actual tip card in place instead of navigating away.
//
// Drop this on any page, anywhere:
//   <script src="https://propz.saylorinnovations.com/widget.js"
//     data-sol="..." data-base="..." data-name="..." async></script>
//
// Deliberately dependency-free vanilla JS (this runs on pages we don't
// control — a framework or a global CSS collision isn't an option) and
// rendered inside a Shadow DOM so nothing here can be affected by, or bleed
// into, the host page's own styles.
(function () {
  if (window.__propzWidgetLoaded) return;
  window.__propzWidgetLoaded = true;

  var script = document.currentScript;
  if (!script || !script.src) return;
  var origin = new URL(script.src).origin;
  var data = script.dataset;

  var params = new URLSearchParams();
  ["sol", "base", "name", "message", "button", "accent"].forEach(function (key) {
    if (data[key]) params.set(key === "button" ? "button" : key, data[key]);
  });
  var embedUrl = origin + "/embed?" + params.toString();
  var label = data.button || "Send Propz";

  function mount() {
    var host = document.createElement("div");
    document.body.appendChild(host);
    var root = host.attachShadow({ mode: "open" });

    var style = document.createElement("style");
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

    var fab = document.createElement("button");
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

    var panel = document.createElement("div");
    panel.className = "panel";
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "✕";
    var iframe = document.createElement("iframe");
    iframe.title = "Propz tip jar";
    iframe.loading = "lazy";
    panel.appendChild(closeBtn);
    panel.appendChild(iframe);
    root.appendChild(panel);

    var open = false;
    function setOpen(next) {
      open = next;
      panel.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", String(open));
      if (open && !iframe.src) iframe.src = embedUrl;
    }
    fab.addEventListener("click", function () { setOpen(!open); });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) setOpen(false);
    });
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
