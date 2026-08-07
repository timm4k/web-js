"use strict";

window.WebTasks.push(
  (() => {
    const ID = "history-api";
    const navigation = () => DOMHelper.query("#spa-navigation");
    const content = () => DOMHelper.query("#spa-content");
    const routeFromUrl = () => {
      const page = new URLSearchParams(window.location.search).get("page");
      return Object.hasOwn(AppConstants.SPA_PAGES, page) ? page : "home";
    };
    const render = (route) => {
      const page = AppConstants.SPA_PAGES[route] || AppConstants.SPA_PAGES.home;
      DOMHelper.clear(content());
      content().append(
        DOMHelper.element("h4", { text: page.title }),
        DOMHelper.element("p", { text: page.text }),
      );
      DOMHelper.queryAll("[data-route]", navigation()).forEach((link) =>
        link.classList.toggle(UIConstants.ACTIVE, link.dataset.route === route),
      );
    };
    const navigate = (route) => {
      const url = new URL(window.location.href);
      url.searchParams.set("page", route);
      history.pushState({ ...history.state, tourRoute: route }, "", url);
      render(route);
      UI.completeTask(
        ID,
        `${AppConstants.SPA_PAGES[route].title} opened inside the band microsite without a page reload`,
      );
    };
    const handleClick = (event) => {
      const link = event.target.closest("[data-route]");
      if (!link) return;
      event.preventDefault();
      navigate(link.dataset.route);
    };
    const handlePopState = (event) => {
      const route = event.state?.tourRoute || routeFromUrl();
      render(route);
      UI.setResult(
        ID,
        `${AppConstants.SPA_PAGES[route].title} restored through the browser’s popstate event`,
        UIConstants.SUCCESS,
      );
    };
    const init = () => {
      render(routeFromUrl());
      navigation().addEventListener("click", handleClick);
      window.addEventListener("popstate", handlePopState);
    };
    return Object.freeze({ init });
  })(),
);
