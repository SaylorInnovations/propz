(function () {
  const nameEl = document.getElementById("name");
  const solEl = document.getElementById("sol");
  const baseEl = document.getElementById("base");
  const saveBtn = document.getElementById("save-btn");
  const editBtn = document.getElementById("edit-btn");
  const formState = document.getElementById("form-state");
  const doneState = document.getElementById("done-state");
  const solErr = document.getElementById("sol-err");
  const baseErr = document.getElementById("base-err");
  const formErr = document.getElementById("form-err");

  function showState(state) {
    formState.classList.toggle("active", state === "form");
    doneState.classList.toggle("active", state === "done");
  }

  chrome.storage.local.get(["propzProfile"], ({ propzProfile }) => {
    if (propzProfile) {
      nameEl.value = propzProfile.name || "";
      solEl.value = propzProfile.sol || "";
      baseEl.value = propzProfile.base || "";
      showState("done");
    }
  });

  editBtn.addEventListener("click", () => showState("form"));

  saveBtn.addEventListener("click", () => {
    const name = nameEl.value.trim();
    const sol = solEl.value.trim();
    const base = baseEl.value.trim();
    const solOk = !sol || validSolanaAddress(sol);
    const baseOk = !base || validEvmAddress(base);
    const hasOne = (sol && validSolanaAddress(sol)) || (base && validEvmAddress(base));

    solErr.classList.toggle("show", Boolean(sol) && !solOk);
    baseErr.classList.toggle("show", Boolean(base) && !baseOk);
    solEl.classList.toggle("err", Boolean(sol) && !solOk);
    baseEl.classList.toggle("err", Boolean(base) && !baseOk);
    formErr.classList.toggle("show", solOk && baseOk && !hasOne);

    if (!solOk || !baseOk || !hasOne) return;

    chrome.storage.local.set(
      {
        propzProfile: {
          name: name || "Your name",
          sol: solOk && sol ? sol : "",
          base: baseOk && base ? base : "",
          accent: "cyan",
        },
      },
      () => showState("done"),
    );
  });
})();
