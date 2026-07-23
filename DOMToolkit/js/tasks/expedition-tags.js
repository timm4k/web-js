"use strict";

function initExpeditionTags() {
  const btn = document.querySelector("#generate-tags-btn");
  if (!btn) {
    return;
  }

  const container = document.querySelector("#expedition-tags-container");

  btn.addEventListener("click", async () => {
    if (!container) {
      return;
    }

    const tagsData = container.getAttribute("data-tags") || "";
    const tagNames = tagsData
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    container.innerHTML = "";
    const tagsWrapper = createEl("div", "tags-container");

    for (let i = 0; i < tagNames.length; i++) {
      await waitForMs(80);

      const tagName = tagNames[i];
      const icon = getTagIcon(tagName);
      const badge = createEl('span', 'badge');
      badge.innerHTML =
        '<span class="badge-icon">' + icon + "</span> " + escapeHtml(tagName);
      tagsWrapper.appendChild(badge);
      await renderModule(badge);
    }

    container.appendChild(tagsWrapper);
    await waitForMs(200);
    addLogEntry("Mission tags generated: " + tagNames.length + " categories");
    showModuleResult(
      "expedition-tags",
      "✅ Mission tags generated. " +
        tagNames.length +
        " categories assigned for expedition planning",
    );
    completeModule("expedition-tags");
  });
}
