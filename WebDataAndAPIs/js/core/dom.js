"use strict";

window.DOMHelper = (() => {
  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const clear = (element) => element.replaceChildren();
  const getTaskView = (taskId) => {
    const card = query(`[data-task-id="${taskId}"]`);
    return {
      card,
      result: query(`#${taskId}-result`),
    };
  };
  const element = (tag, options = {}) => {
    const node = document.createElement(tag);
    if (options.className) node.className = options.className;
    if (options.text !== undefined) node.textContent = options.text;
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([name, value]) =>
        node.setAttribute(name, value),
      );
    }
    return node;
  };
  return Object.freeze({ query, queryAll, clear, getTaskView, element });
})();
