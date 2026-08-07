"use strict";

window.FormTasks = window.FormTasks || [];
window.FormTasks.push(
  (() => {
    const ID = "team-contact";
    let active = false;
    const input = () => DOMHelper.query("#team-contact-email");
    const hint = () => DOMHelper.query("#team-contact-hint");
    const handleFocus = (event) => {
      if (!active) return;
      hint().hidden = false;
      event.currentTarget.classList.add(UIConstants.FOCUSED);
      event.currentTarget.classList.remove(UIConstants.INVALID);
      event.currentTarget.setAttribute("aria-invalid", "false");
      UI.log(ID, "[focus] Email hint displayed · blue focus border applied");
      UI.setResult(ID, "Focus received · Race Control guidance is visible");
    };
    const handleBlur = (event) => {
      if (!active) return;
      hint().hidden = true;
      event.currentTarget.classList.remove(UIConstants.FOCUSED);
      const empty = event.currentTarget.value.trim() === "";
      event.currentTarget.classList.toggle(UIConstants.INVALID, empty);
      event.currentTarget.setAttribute("aria-invalid", String(empty));
      UI.log(ID, `[blur] Hint hidden · empty: ${empty}`);
      UI.completeTask(
        ID,
        empty
          ? "Blur detected · empty email marked red"
          : "Blur detected · email retained without an error",
      );
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Focus the email field, then leave it to test blur validation",
      );
      input().focus();
    };
    const reset = () => {
      active = false;
      input().value = "";
      input().classList.remove(UIConstants.FOCUSED, UIConstants.INVALID);
      input().setAttribute("aria-invalid", "false");
      hint().hidden = true;
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      input().addEventListener("focus", handleFocus);
      input().addEventListener("blur", handleBlur);
    };
    return Object.freeze({ init });
  })(),
);
