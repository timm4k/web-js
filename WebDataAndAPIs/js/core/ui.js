"use strict";

window.UI = (() => {
  const setResult = (taskId, message, state = "") => {
    const result = DOMHelper.getTaskView(taskId).result;
    result.textContent = message;
    result.className = `result${state ? ` ${state}` : ""}`;
  };
  const completeTask = (taskId, message) => {
    setResult(taskId, message, UIConstants.SUCCESS);
    document.dispatchEvent(
      new CustomEvent(AppConstants.EVENT_TASK_COMPLETE, { detail: { taskId } }),
    );
  };
  const showError = (taskId, message) =>
    setResult(taskId, message, UIConstants.ERROR);
  const toast = (message) => {
    const region = DOMHelper.query(".toast-region");
    const toastElement = DOMHelper.element("div", {
      className: "toast",
      text: message,
    });
    region.append(toastElement);
    window.setTimeout(() => {
      toastElement.classList.add("leaving");
      window.setTimeout(() => toastElement.remove(), 220);
    }, UIConstants.TOAST_DURATION);
  };
  return Object.freeze({ setResult, completeTask, showError, toast });
})();
