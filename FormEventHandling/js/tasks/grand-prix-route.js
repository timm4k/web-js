"use strict";

window.FormTasks.push(
  (() => {
    const ID = "grand-prix-route";
    let active = false;
    const country = () => DOMHelper.query("#country-select");
    const city = () => DOMHelper.query("#city-select");
    const setInitialCity = (text) =>
      city().replaceChildren(new Option(text, ""));
    const handleChange = (event) => {
      if (!active) return;
      const selectedCountry = event.currentTarget.value;
      if (!selectedCountry) {
        setInitialCity("Choose country first");
        city().disabled = true;
        UI.setResult(ID, "Choose a country to unlock its city list");
        return;
      }
      const options = AppConstants.LOCATIONS[selectedCountry].map(
        (name) => new Option(name, name.toLowerCase().replaceAll(" ", "-")),
      );
      city().replaceChildren(new Option("Choose city", ""), ...options);
      city().disabled = false;
      UI.log(
        ID,
        `[change] ${selectedCountry} → ${options.length} city options created with new Option()`,
      );
      UI.completeTask(
        ID,
        `${event.currentTarget.selectedOptions[0].textContent} loaded · City selection unlocked`,
      );
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Select a country to rebuild and unlock the city field",
      );
      country().focus();
    };
    const reset = () => {
      active = false;
      country().value = "";
      setInitialCity("Choose country first");
      city().disabled = true;
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      country().addEventListener("change", handleChange);
    };
    return Object.freeze({ init });
  })(),
);
