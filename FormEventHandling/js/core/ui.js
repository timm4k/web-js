"use strict";

window.UI = (() => {
  const prepareTask = (taskId, message) => {
    const view = DOMHelper.getTaskView(taskId);
    view.result.textContent = message;
    view.result.className = "result";
    DOMHelper.clear(view.log);
    return view;
  };
  const setResult = (taskId, message, success = false) => {
    const result = DOMHelper.getTaskView(taskId).result;
    result.textContent = message;
    result.className = success ? "result success" : "result";
  };
  const completeTask = (taskId, message) => {
    setResult(taskId, message, true);
    document.dispatchEvent(
      new CustomEvent(AppConstants.EVENT_TASK_COMPLETE, { detail: { taskId } }),
    );
  };
  const resetTask = (taskId) => {
    const view = DOMHelper.getTaskView(taskId);
    view.result.textContent = "";
    view.result.className = "result";
    DOMHelper.clear(view.log);
  };
  const log = (taskId, message) => {
    const target = DOMHelper.getTaskView(taskId).log;
    const entry = document.createElement("div");
    entry.className = "event-log__entry";
    entry.textContent = message;
    target.append(entry);
    if (target.children.length > UIConstants.MAX_LOG_ENTRIES)
      target.firstElementChild.remove();
  };
  const toast = (message) => {
    const region = DOMHelper.query(".toast-region");
    const element = document.createElement("div");
    element.className = "toast";
    element.textContent = message;
    region.append(element);
    window.setTimeout(() => {
      element.classList.add("leaving");
      window.setTimeout(() => element.remove(), 220);
    }, UIConstants.TOAST_DURATION);
  };
  return Object.freeze({
    prepareTask,
    setResult,
    completeTask,
    resetTask,
    log,
    toast,
  });
})();
