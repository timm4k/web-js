"use strict";

window.FormTasks.push(
  (() => {
    const ID = "pit-wall-security";
    let active = false;
    const password = () => DOMHelper.query("#pit-password");
    const confirmation = () => DOMHelper.query("#pit-password-repeat");
    const blockExport = (event) => {
      if (!active) return;
      event.preventDefault();
      UI.log(ID, `[${event.type}] Password export blocked with preventDefault`);
      UI.completeTask(
        ID,
        `${event.type} was blocked by the Pit Wall security protocol`,
      );
    };
    const blockPaste = (event) => {
      if (!active) return;
      event.preventDefault();
      UI.log(ID, "[paste] Confirmation paste blocked with preventDefault");
      alert("Enter the password manually");
      UI.completeTask(
        ID,
        "Paste was blocked · manual password confirmation is required",
      );
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Try copy or cut in the first field and paste in the second field",
      );
      password().focus();
    };
    const reset = () => {
      active = false;
      password().value = "";
      confirmation().value = "";
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      password().addEventListener("copy", blockExport);
      password().addEventListener("cut", blockExport);
      confirmation().addEventListener("paste", blockPaste);
    };
    return Object.freeze({ init });
  })(),
);
