"use strict";

window.FormTasks.push(
  (() => {
    const ID = "race-regulations";
    let active = false;
    const checkbox = () => DOMHelper.query("#regulations-check");
    const submit = () => DOMHelper.query("#regulations-submit");
    const handleChange = (event) => {
      if (!active) return;
      submit().disabled = !event.currentTarget.checked;
      UI.log(
        ID,
        `[change] checked: ${event.currentTarget.checked} · disabled: ${submit().disabled}`,
      );
      if (event.currentTarget.checked)
        UI.completeTask(ID, "Regulations accepted · Submit Entry unlocked");
      else UI.setResult(ID, "Agreement removed · Submit Entry locked again");
    };
    const handleSubmit = () => {
      if (active && !submit().disabled)
        UI.toast("Race entry submitted to Control");
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Toggle the checkbox to control the disabled button state",
      );
    };
    const reset = () => {
      active = false;
      checkbox().checked = false;
      submit().disabled = true;
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      checkbox().addEventListener("change", handleChange);
      submit().addEventListener("click", handleSubmit);
    };
    return Object.freeze({ init });
  })(),
);
