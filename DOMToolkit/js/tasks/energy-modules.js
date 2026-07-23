"use strict";

function initEnergyModules() {
  const btn = document.querySelector("#run-diagnostics-btn");
  if (!btn) {
    return;
  }

  const container = document.querySelector("#energy-modules-list");

  btn.addEventListener("click", async () => {
    if (!container) {
      return;
    }

    const modules = container.querySelectorAll(".module-card");
    if (modules.length === 0) {
      return;
    }

    const issues = [];

    modules.forEach((module) => {
      module.setAttribute("data-charge", randomInt(0, 100));
      const statusEl = module.querySelector(".module-status");
      const barFill = module.querySelector(".progress-bar-fill");
      module.className = "module-card scanning";
      if (statusEl) {
        statusEl.textContent = "Scanning...";
        statusEl.className = "module-status";
      }
      if (barFill) {
        barFill.style.width = "0%";
      }
    });

    for (let i = 0; i < modules.length; i++) {
      await waitForMs(400);

      const module = modules[i];
      const charge = parseInt(module.getAttribute("data-charge"), 10);
      const type = module.getAttribute("data-type") || "Unknown";
      const level = getChargeLevel(charge);

      const nameEl = module.querySelector(".module-name");
      const statusEl = module.querySelector(".module-status");
      const barFill = module.querySelector(".progress-bar-fill");

      if (nameEl) {
        nameEl.innerHTML = level.icon + " " + escapeHtml(type) + " Module";
      }
      if (statusEl) {
        statusEl.textContent = level.label + " — " + charge + "%";
        statusEl.className = "module-status " + level.cssClass;
      }
      if (barFill) {
        barFill.style.width = charge + "%";
        if (charge === 0) {
          barFill.style.background =
            "linear-gradient(90deg, rgba(255,60,60,0.4), rgba(255,60,60,0.7))";
        } else if (charge < 30) {
          barFill.style.background =
            "linear-gradient(90deg, rgba(255,80,80,0.4), rgba(255,80,80,0.7))";
        } else if (charge < 70) {
          barFill.style.background =
            "linear-gradient(90deg, rgba(255,184,77,0.4), rgba(255,184,77,0.7))";
        } else {
          barFill.style.background =
            "linear-gradient(90deg, rgba(80,255,150,0.4), rgba(80,255,150,0.7))";
        }
      }

      module.className = "module-card " + level.cssClass;
      await renderModule(module);

      if (charge < 70) {
        issues.push(type);
      }
    }

    await waitForMs(200);
    const operational = modules.length - issues.length;
    const msgType = issues.length > 0 ? "warning" : "success";
    const msg =
      issues.length > 0
        ? "⚠ Power diagnostics complete. " +
          operational +
          "/" +
          modules.length +
          " modules operational. " +
          issues.length +
          " require maintenance: " +
          issues.join(", ")
        : "✅ Power diagnostics complete. All " +
          modules.length +
          " modules operational.";
    addLogEntry(
      "Power diagnostics: " +
        operational +
        "/" +
        modules.length +
        " operational",
    );
    showModuleResult("energy-modules", msg, msgType);
    completeModule("energy-modules");
  });
}
