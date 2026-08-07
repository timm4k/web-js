"use strict";

window.FormTasks.push(
  (() => {
    const ID = "garage-signals";
    let active = false;
    const form = () => DOMHelper.query("#garage-signals-form");
    const handleChange = (event) => {
      if (!active || event.target.type !== "radio") return;
      const selected = [...form().elements.signalColor].find(
        (radio) => radio.checked,
      );
      document.body.style.background = selected.value;
      UI.log(
        ID,
        `[change] form.elements.signalColor → ${selected.parentElement.textContent.trim()}`,
      );
      UI.completeTask(
        ID,
        `${selected.parentElement.textContent.trim()} signal now controls the page background`,
      );
    };
    const activate = () => {
      active = true;
      UI.prepareTask(ID, "Select a signal through the form radio collection");
    };
    const reset = () => {
      active = false;
      form().reset();
      document.body.style.background = "";
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      form().addEventListener("change", handleChange);
    };
    return Object.freeze({ init });
  })(),
);
