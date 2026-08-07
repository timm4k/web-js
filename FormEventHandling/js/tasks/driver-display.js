"use strict";

window.FormTasks.push(
  (() => {
    const ID = "driver-display";
    let active = false;
    const field = () => DOMHelper.query("#driver-name");
    const preview = () => DOMHelper.query("#driver-name-preview");
    const handleInput = (event) => {
      if (!active) return;
      const value = event.currentTarget.value;
      preview().textContent = value || "Awaiting driver";
      UI.log(ID, `[input] value: ${value || "empty"}`);
      if (value)
        UI.completeTask(
          ID,
          "The timing board mirrors every character instantly",
        );
      else UI.setResult(ID, "The timing board is waiting for input");
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Type any driver name and watch the live timing board",
      );
      preview().textContent = field().value || "Awaiting driver";
      if (field().value)
        UI.setResult(
          ID,
          "Existing input synchronized · continue typing to test the input event",
        );
      field().focus();
    };
    const reset = () => {
      active = false;
      field().value = "";
      preview().textContent = "Awaiting driver";
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      field().addEventListener("input", handleInput);
    };
    return Object.freeze({ init });
  })(),
);
