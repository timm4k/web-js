"use strict";

window.FormTasks.push(
  (() => {
    const ID = "garage-otp";
    let active = false;
    const row = () => DOMHelper.query("#garage-otp-row");
    const fields = () => DOMHelper.queryAll(".otp-input", row());
    const reportCode = () => {
      const code = fields()
        .map((field) => field.value)
        .join("");
      UI.log(ID, `[input] Code buffer: ${code.padEnd(4, "_")}`);
      if (/^\d{4}$/.test(code))
        UI.completeTask(
          ID,
          "Four digits accepted · restricted garage access unlocked",
        );
    };
    const handleInput = (event) => {
      if (!active || !event.target.matches(".otp-input")) return;
      event.target.value = event.target.value.replace(/\D/g, "").slice(-1);
      if (
        event.target.value &&
        event.target.nextElementSibling instanceof HTMLInputElement
      )
        event.target.nextElementSibling.focus();
      reportCode();
    };
    const handleKeydown = (event) => {
      if (
        !active ||
        !event.target.matches(".otp-input") ||
        event.key !== "Backspace" ||
        event.target.value
      )
        return;
      if (event.target.previousElementSibling instanceof HTMLInputElement) {
        event.preventDefault();
        event.target.previousElementSibling.focus();
        event.target.previousElementSibling.value = "";
        UI.log(ID, "[keydown] Backspace returned focus to the previous digit");
      }
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Enter four digits · focus advances after every input",
      );
      fields()[0].focus();
    };
    const reset = () => {
      active = false;
      fields().forEach((field) => {
        field.value = "";
      });
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      row().addEventListener("input", handleInput);
      row().addEventListener("keydown", handleKeydown);
    };
    return Object.freeze({ init });
  })(),
);
