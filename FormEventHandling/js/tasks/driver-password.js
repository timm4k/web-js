"use strict";

window.FormTasks.push(
  (() => {
    const ID = "driver-password";
    let active = false;
    const input = () => DOMHelper.query("#driver-password-input");
    const register = () => DOMHelper.query("#driver-register");
    const rules = Object.freeze({
      length: (value) => value.length > 8,
      number: (value) => /\d/.test(value),
      uppercase: (value) => /[A-Z]/.test(value),
    });
    const handleInput = (event) => {
      if (!active) return;
      const value = event.currentTarget.value;
      const states = Object.entries(rules).map(([name, validate]) => {
        const valid = validate(value);
        DOMHelper.query(`[data-rule="${name}"]`).classList.toggle(
          UIConstants.VALID,
          valid,
        );
        return valid;
      });
      const validPassword = states.every(Boolean);
      register().disabled = !validPassword;
      UI.log(
        ID,
        `[input] length: ${states[0]} · number: ${states[1]} · uppercase: ${states[2]}`,
      );
      if (validPassword)
        UI.completeTask(
          ID,
          "All live checks passed · Register Driver unlocked",
        );
      else
        UI.setResult(ID, "Telemetry updates every password rule in real time");
    };
    const handleRegister = () => {
      if (active && !register().disabled)
        UI.toast("Driver registered for the race weekend");
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Build a password that satisfies all three live rules",
      );
      input().focus();
    };
    const reset = () => {
      active = false;
      input().value = "";
      register().disabled = true;
      DOMHelper.queryAll(
        ".rule-list li",
        DOMHelper.query("#driver-password-form"),
      ).forEach((rule) => rule.classList.remove(UIConstants.VALID));
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      input().addEventListener("input", handleInput);
      register().addEventListener("click", handleRegister);
    };
    return Object.freeze({ init });
  })(),
);
