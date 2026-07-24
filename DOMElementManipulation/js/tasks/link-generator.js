window.LinkGenerator = (function () {
  "use strict";

  const MODULE_ID = "link-generator";

  const LINKS = [
    { name: "Philosopher's stone", url: "#philosophers-stone" },
    { name: "Elixir of life", url: "#elixir-of-life" },
    { name: "Transmutation circle", url: "#transmutation-circle" },
    { name: "Prima materia", url: "#prima-materia" },
    { name: "Alkahest universal solvent", url: "#alkahest" },
    { name: "Magnum opus stages", url: "#magnum-opus" },
  ];

  function init() {
    const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
    if (!card) return;
    const visual = DOMHelper.query(".card__visual", card);
    const btn = DOMHelper.query(".btn", card);
    if (!visual || !btn) return;

    const heading = DOMHelper.create("h4", {
      textContent: "Magical tome index",
      style: {
        color: "#d4b8ff",
        marginBottom: "8px",
        borderBottom: "1px solid rgba(180,130,255,0.2)",
        paddingBottom: "6px",
      },
    });
    visual.appendChild(heading);

    const placeholder = DOMHelper.create("p", {
      textContent: "[ No entries yet — awaiting generation... ]",
      style: { color: "#8b7aa8", fontStyle: "italic", fontSize: "13px" },
    });
    visual.appendChild(placeholder);

    btn.addEventListener("click", function () {
      btn.disabled = true;
      run(placeholder, visual, btn);
    });
  }

  async function run(placeholder, visual, btn) {
    await AnimationHelper.waitFor(300);

    const parts = ['<ul style="list-style:none;padding:0;margin:0;">'];
    LINKS.forEach(function (entry) {
      parts.push(
        '<li style="padding:6px 0;border-bottom:1px solid rgba(180,130,255,0.1);">' +
          '<a href="' +
          entry.url +
          '" style="color:#b482ff;text-decoration:none;font-family:monospace;font-size:13px;">' +
          "&#9733; " +
          entry.name +
          "</a></li>",
      );
    });
    parts.push("</ul>");

    const htmlString = parts.join("\n");
    placeholder.textContent = "";
    placeholder.style.fontStyle = "normal";
    placeholder.innerHTML = htmlString;

    await AnimationHelper.waitFor(400);

    const links = DOMHelper.queryAll("a", placeholder);
    await AnimationHelper.waitFor(300);

    const escaped = htmlString.replace(/</g, "&lt;");
    const resultHtml =
      "<strong>Generated Tome Index</strong><br>" +
      "Links created: <code>" +
      links.length +
      "</code><br><br>" +
      "<strong>innerHTML output:</strong><br>" +
      '<pre style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px;font-size:11px;color:#d4b8ff;white-space:pre-wrap;word-wrap:break-word;line-height:1.6;max-height:180px;overflow-y:auto;border:1px solid rgba(180,130,255,0.1);">' +
      escaped +
      "</pre>";

    const panel = UIHelper.renderResultPanel(
      "Link Generation 」ムー",
      resultHtml,
    );
    visual.appendChild(panel);

    ProgressTracker.completeModule(MODULE_ID);
    UIHelper.markModuleComplete(MODULE_ID);
    btn.textContent = "Complete!";
  }

  return { init: init };
})();
