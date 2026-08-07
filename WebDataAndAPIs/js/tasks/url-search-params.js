"use strict";

window.WebTasks.push(
  (() => {
    const ID = "url-search-params";
    const controls = () => DOMHelper.query("#url-search-params-controls");
    const allowedFilters = new Set(["all", "active", "completed"]);
    const filterLabels = Object.freeze({
      all: "All Tracks",
      active: "On Tour",
      completed: "Retired",
    });
    const currentFilter = () => {
      const value =
        new URLSearchParams(window.location.search).get("filter") || "all";
      return allowedFilters.has(value) ? value : "all";
    };
    const render = (filter) => {
      DOMHelper.queryAll("[data-filter]", controls()).forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle(UIConstants.ACTIVE, active);
        button.setAttribute("aria-pressed", String(active));
      });
      DOMHelper.query("#url-search-params-value").textContent =
        `Selected setlist: ${filterLabels[filter]}`;
    };
    const selectFilter = (filter) => {
      const url = new URL(window.location.href);
      url.searchParams.set("filter", filter);
      history.pushState({ ...history.state, archiveFilter: filter }, "", url);
      render(filter);
      UI.completeTask(ID, `${filterLabels[filter]} saved in the shareable URL`);
    };
    const handleClick = (event) => {
      const button = event.target.closest("[data-filter]");
      if (button) selectFilter(button.dataset.filter);
    };
    const handlePopState = () => render(currentFilter());
    const init = () => {
      render(currentFilter());
      controls().addEventListener("click", handleClick);
      window.addEventListener("popstate", handlePopState);
    };
    return Object.freeze({ init });
  })(),
);
