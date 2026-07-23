"use strict";

function initOrbitalModules() {
  const btn = document.querySelector("#display-modules-btn");
  if (!btn) {
    return;
  }

  const orbitalList = document.querySelector("#orbital-modules-list");

  btn.addEventListener("click", async () => {
    if (!orbitalList) {
      return;
    }

    const items = orbitalList.querySelectorAll("li");

    for (let index = 0; index < items.length; index++) {
      await waitForMs(120);

      const item = items[index];
      const name = item.textContent;
      const isEven = index % 2 === 0;

      item.innerHTML = "";
      item.className = isEven ? "orbital-even" : "orbital-odd";
      item.appendChild(createEl("span", "orbital-index", "#" + (index + 1)));
      item.appendChild(createEl("span", "orbital-name", escapeHtml(name)));

      if ((index + 1) % 3 === 0) {
        item.appendChild(
          createEl("span", "orbital-special", ORBITAL_MODULE_SPECIAL_MARKER),
        );
      }
      await renderModule(item);
    }

    await waitForMs(200);
    addLogEntry(
      "Orbital station grid activated: " + items.length + " modules mapped",
    );
    showModuleResult(
      "orbital-modules",
      "✅ Orbital station grid activated. " +
        items.length +
        " modules mapped and numbered",
    );
    completeModule("orbital-modules");
  });
}
