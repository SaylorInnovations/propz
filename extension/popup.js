(function () {
  // Mirrors app/lib/pages.ts's normalizePageUrl — same reasoning as
  // validators.js: no shared build step with the main app, kept in sync by
  // hand. Used only to key the local propzTokens map the same way the
  // server keys registrations, so "do we have the token for this page" and
  // "is this page registered" agree with each other.
  function normalizeUrl(raw) {
    let u;
    try {
      u = new URL(raw);
    } catch {
      return null;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    const path = u.pathname.replace(/\/+$/, "") || "/";
    // u.host (not hostname) — hostname silently drops a non-default port.
    return `${u.protocol}//${u.host.toLowerCase()}${path}`;
  }

  const states = ["loading", "need-profile", "not-registered", "registered-mine", "registered-other"];
  function show(id) {
    for (const s of states) document.getElementById(s).style.display = s === id ? "block" : "none";
  }
  document.getElementById("loading").style.display = "block";

  let currentUrl = "";
  let currentTabId = null;
  let normalized = "";
  let profile = null;

  document.getElementById("setup-btn").addEventListener("click", () => chrome.runtime.getURL && chrome.tabs.create({ url: chrome.runtime.getURL("onboarding.html") }));
  document.getElementById("edit-link").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL("onboarding.html") });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentUrl = tabs[0]?.url || "";
    currentTabId = tabs[0]?.id ?? null;
    normalized = normalizeUrl(currentUrl);

    if (!normalized) {
      document.getElementById("not-registered-text").textContent =
        "Propz can't run on this kind of page (browser or extension pages aren't supported).";
      show("not-registered");
      document.getElementById("enable-btn").disabled = true;
      return;
    }

    chrome.storage.local.get(["propzProfile", "propzTokens"], ({ propzProfile, propzTokens }) => {
      profile = propzProfile || null;
      const tokens = propzTokens || {};

      if (!profile) {
        show("need-profile");
        return;
      }

      chrome.runtime.sendMessage({ type: "propz:lookup", url: currentUrl }, (result) => {
        if (chrome.runtime.lastError) {
          document.getElementById("not-registered-text").textContent = "Couldn't reach Propz right now.";
          show("not-registered");
          document.getElementById("enable-btn").disabled = true;
          return;
        }

        if (result && result.registered) {
          const ourToken = tokens[normalized];
          if (ourToken) {
            document.getElementById("mine-name").textContent = result.name || profile.name;
            show("registered-mine");
            document.getElementById("revert-btn").addEventListener("click", () => {
              document.getElementById("revert-btn").disabled = true;
              chrome.runtime.sendMessage({ type: "propz:revert", url: currentUrl, editToken: ourToken, tabId: currentTabId }, (res) => {
                if (res && res.status && res.status < 300) {
                  const next = { ...tokens };
                  delete next[normalized];
                  chrome.storage.local.set({ propzTokens: next }, () => window.close());
                } else {
                  document.getElementById("revert-btn").disabled = false;
                }
              });
            });
          } else {
            show("registered-other");
          }
          return;
        }

        document.getElementById("not-registered-text").textContent = `Show a tip button here as "${profile.name}"?`;
        show("not-registered");
        document.getElementById("enable-btn").addEventListener("click", () => {
          const btn = document.getElementById("enable-btn");
          btn.disabled = true;
          btn.textContent = "Setting up…";
          chrome.runtime.sendMessage(
            {
              type: "propz:register",
              tabId: currentTabId,
              payload: {
                url: currentUrl,
                name: profile.name,
                sol: profile.sol,
                base: profile.base,
                accent: profile.accent,
              },
            },
            (res) => {
              if (res && res.status && res.status < 300 && res.data?.editToken) {
                const next = { ...tokens, [normalized]: res.data.editToken };
                chrome.storage.local.set({ propzTokens: next }, () => window.close());
              } else {
                btn.disabled = false;
                btn.textContent = "Show my tip button on this page";
              }
            },
          );
        });
      });
    });
  });
})();
