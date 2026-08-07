"use strict";

window.WebTasks.push(
  (() => {
    const ID = "cookie-management";
    const banner = () => DOMHelper.query("#cookie-banner");
    const status = () => DOMHelper.query("#cookie-status");
    const hasConsent = () =>
      document.cookie
        .split(";")
        .map((part) => part.trim())
        .includes(`${AppConstants.COOKIE_NAME}=true`);
    const render = () => {
      const accepted = hasConsent();
      banner().hidden = accepted;
      status().textContent = accepted
        ? "Venue access remembered for this browser"
        : "Venue access has not been accepted";
      UI.setResult(
        ID,
        accepted
          ? "One-hour venue cookie detected"
          : "The venue notice is waiting for consent",
        accepted ? UIConstants.SUCCESS : "",
      );
      return accepted;
    };
    const accept = () => {
      document.cookie = `${AppConstants.COOKIE_NAME}=true; max-age=${AppConstants.COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
      const accepted = render();
      if (accepted)
        UI.completeTask(
          ID,
          "Venue consent stored for one hour · reload to verify that the notice stays hidden",
        );
      else
        UI.showError(
          ID,
          "This browser context does not permit cookies. Open the project through a local server",
        );
    };
    const clear = () => {
      document.cookie = `${AppConstants.COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax`;
      render();
    };
    const init = () => {
      render();
      DOMHelper.query("#cookie-accept").addEventListener("click", accept);
      DOMHelper.query("#cookie-recheck").addEventListener("click", render);
      DOMHelper.query("#cookie-clear").addEventListener("click", clear);
    };
    return Object.freeze({ init });
  })(),
);
