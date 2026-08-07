"use strict";

window.WebTasks.push(
  (() => {
    const ID = "local-storage";
    const greeting = () => DOMHelper.query("#band-greeting");
    const entry = () => DOMHelper.query("#band-entry");
    const input = () => DOMHelper.query("#band-name");
    const save = () => DOMHelper.query("#band-save");
    const removeButton = () => DOMHelper.query("#band-remove");
    const renderBand = (bandName) => {
      const known = Boolean(bandName);
      greeting().textContent = known
        ? `Tonight’s Headliner · ${bandName}`
        : "No Headliner Registered";
      entry().hidden = known;
      save().hidden = known;
      removeButton().hidden = !known;
    };
    const readBand = () => {
      try {
        return localStorage.getItem(AppConstants.STORAGE_BAND) || "";
      } catch {
        UI.showError(ID, "LocalStorage is unavailable in this browser context");
        return "";
      }
    };
    const handleSave = () => {
      const bandName = input().value.trim();
      if (!bandName) {
        UI.showError(ID, "Enter an original band name before registration");
        input().focus();
        return;
      }
      try {
        localStorage.setItem(AppConstants.STORAGE_BAND, bandName);
        renderBand(localStorage.getItem(AppConstants.STORAGE_BAND));
        UI.completeTask(
          ID,
          "Band registered as tonight’s headliner · reload to confirm localStorage persistence",
        );
      } catch {
        UI.showError(ID, "The headliner could not be saved");
      }
    };
    const handleRemove = () => {
      try {
        localStorage.removeItem(AppConstants.STORAGE_BAND);
      } catch {}
      input().value = "";
      renderBand("");
      UI.setResult(
        ID,
        "Saved band removed · a new headliner can now be registered",
      );
      input().focus();
    };
    const init = () => {
      const storedBand = readBand();
      renderBand(storedBand);
      if (storedBand)
        UI.setResult(
          ID,
          "Saved headliner restored from localStorage",
          UIConstants.SUCCESS,
        );
      save().addEventListener("click", handleSave);
      removeButton().addEventListener("click", handleRemove);
      input().addEventListener("keydown", (event) => {
        if (event.key === "Enter") handleSave();
      });
    };
    return Object.freeze({ init });
  })(),
);
