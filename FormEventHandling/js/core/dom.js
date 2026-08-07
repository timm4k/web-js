"use strict";

window.DOMHelper = (() => {
  const query = (selector, parent = document) => parent.querySelector(selector);
  const queryAll = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];
  const getTaskView = (taskId) => {
    const card = query(`[data-task-id="${taskId}"]`);
    return {
      card,
      result: query(`#${taskId}-result`),
      log: query(`#${taskId}-log`),
      activateButton: query('[data-action="activate"]', card),
      resetButton: query('[data-action="reset"]', card),
    };
  };
  const bindTask = (taskId, activate, reset) => {
    const view = getTaskView(taskId);
    view.activateButton.addEventListener("click", activate);
    view.resetButton.addEventListener("click", reset);
    return view;
  };
  const clear = (element) => element.replaceChildren();
  return Object.freeze({ query, queryAll, getTaskView, bindTask, clear });
})();
