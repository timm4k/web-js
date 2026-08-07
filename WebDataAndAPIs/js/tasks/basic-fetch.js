"use strict";

window.WebTasks.push(
  (() => {
    const ID = "basic-fetch";
    let loading = false;
    const button = () => DOMHelper.query("#basic-fetch-load");
    const output = () => DOMHelper.query("#basic-fetch-text");
    const loadFact = async () => {
      if (loading) return;
      loading = true;
      button().disabled = true;
      UI.setResult(ID, "Calling the tour bus cat through a remote API");
      try {
        const response = await fetch(AppConstants.CAT_FACT_API, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        output().textContent = data.fact;
        UI.completeTask(
          ID,
          "The tour cat returned a JSON fact without reloading the archive",
        );
      } catch (error) {
        UI.showError(
          ID,
          "The tour cat radio is unavailable. Try again when the network returns",
        );
      } finally {
        loading = false;
        button().disabled = false;
      }
    };
    const init = () => button().addEventListener("click", loadFact);
    return Object.freeze({ init });
  })(),
);
