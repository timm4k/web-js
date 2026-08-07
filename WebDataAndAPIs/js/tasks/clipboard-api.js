"use strict";

window.WebTasks.push(
  (() => {
    const ID = "clipboard-api";
    let restoreTimer = 0;
    const button = () => DOMHelper.query("#clipboard-copy");
    const text = () => DOMHelper.query("#clipboard-text");
    const updateNetworkState = () => {
      const online = navigator.onLine;
      button().disabled = !online;
      button().textContent = online
        ? "Copy Setlist Note"
        : "Tour Network Offline";
      UI.setResult(
        ID,
        online
          ? "Tour network online · setlist copying is available"
          : "Tour network offline · setlist copying is disabled",
        online ? "" : UIConstants.ERROR,
      );
    };
    const copy = async () => {
      if (!navigator.onLine) {
        updateNetworkState();
        return;
      }
      if (!navigator.clipboard?.writeText) {
        UI.showError(
          ID,
          "Clipboard API requires a secure localhost or HTTPS context",
        );
        return;
      }
      try {
        await navigator.clipboard.writeText(text().value);
        window.clearTimeout(restoreTimer);
        button().textContent = "Copied!";
        UI.completeTask(
          ID,
          "Tonight’s setlist note copied · the button restores after two seconds",
        );
        restoreTimer = window.setTimeout(() => {
          button().textContent = navigator.onLine
            ? "Copy Setlist Note"
            : "Tour Network Offline";
        }, 2000);
      } catch (error) {
        UI.showError(ID, "Clipboard permission was denied by the browser");
      }
    };
    const init = () => {
      button().addEventListener("click", copy);
      window.addEventListener("online", updateNetworkState);
      window.addEventListener("offline", updateNetworkState);
      updateNetworkState();
    };
    return Object.freeze({ init });
  })(),
);
