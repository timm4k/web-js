"use strict";

window.WebTasks.push(
  (() => {
    const ID = "location-object";
    const list = () => DOMHelper.query("#location-list");
    const addRow = (label, value) => {
      const item = DOMHelper.element("li");
      item.append(
        DOMHelper.element("strong", { text: `${label}: ` }),
        document.createTextNode(value || "Not available"),
      );
      list().append(item);
    };
    const inspect = () => {
      const { href, hostname, pathname, search } = window.location;
      const id =
        new URLSearchParams(search).get("id") || "No tour ID in the address";
      DOMHelper.clear(list());
      addRow("Current page URL (href)", href);
      addRow(
        "Server host (hostname)",
        hostname || "Local file without a server",
      );
      addRow("Open page path (pathname)", pathname);
      addRow("Tour ID from ?id=", id);
      UI.completeTask(
        ID,
        "The address of this open archive page was read from window.location",
      );
    };
    const init = () =>
      DOMHelper.query("#location-inspect").addEventListener("click", inspect);
    return Object.freeze({ init });
  })(),
);
