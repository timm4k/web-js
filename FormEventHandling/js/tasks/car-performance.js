"use strict";

window.FormTasks.push(
  (() => {
    const ID = "car-performance";
    let active = false;
    const select = () => DOMHelper.query("#car-select");
    const speed = () => DOMHelper.query("#car-speed");
    const handleChange = (event) => {
      if (!active) return;
      const selectedCar = event.currentTarget.value;
      speed().value = selectedCar
        ? AppConstants.CAR_SPEEDS[selectedCar] + " km/h"
        : "";
      UI.log(
        ID,
        `[change] select.value: ${selectedCar || "empty"} · maximum speed: ${speed().value || 0}`,
      );
      if (selectedCar)
        UI.completeTask(
          ID,
          `${event.currentTarget.selectedOptions[0].textContent} maximum speed loaded automatically`,
        );
      else UI.setResult(ID, "Choose a race car to load its performance data");
    };
    const activate = () => {
      active = true;
      UI.prepareTask(
        ID,
        "Select a race car and inspect the readonly maximum-speed field",
      );
      select().focus();
    };
    const reset = () => {
      active = false;
      select().value = "";
      speed().value = "";
      UI.resetTask(ID);
    };
    const init = () => {
      DOMHelper.bindTask(ID, activate, reset);
      select().addEventListener("change", handleChange);
    };
    return Object.freeze({ init });
  })(),
);
