"use strict";

function initSystemMonitor() {
  const btn = document.querySelector("#check-systems-btn");
  if (!btn) {
    return;
  }

  const container = document.querySelector("#system-monitor-container");

  btn.addEventListener("click", async () => {
    if (!container) {
      return;
    }

    const systemRows = container.querySelectorAll(".system-row");

    systemRows.forEach((row) => {
      const barFill = row.querySelector(".bar");
      const percentEl = row.querySelector(".system-percent");
      const statusTextEl = row.querySelector(".system-status-text");
      if (barFill) {
        barFill.style.width = "0%";
        barFill.className = "bar";
      }
      if (percentEl) {
        percentEl.textContent = "...";
        percentEl.className = "system-percent";
      }
      if (statusTextEl) {
        statusTextEl.textContent = "Checking";
        statusTextEl.className = "system-status-text";
      }
    });

    let minHealth = 100;

    for (let i = 0; i < systemRows.length; i++) {
      await waitForMs(300);

      const row = systemRows[i];
      const health = parseInt(row.getAttribute("data-percent"), 10);
      const level = getHealthLevel(health);

      if (health < minHealth) {
        minHealth = health;
      }

      const barFill = row.querySelector(".bar");
      const percentEl = row.querySelector(".system-percent");
      const statusTextEl = row.querySelector(".system-status-text");
      if (barFill) {
        barFill.style.width = health + "%";
        barFill.className = "bar " + level.cssClass;
      }
      if (percentEl) {
        percentEl.textContent = health + "%";
        percentEl.className = "system-percent " + level.cssClass;
      }
      if (statusTextEl) {
        statusTextEl.textContent = level.label;
        statusTextEl.className = "system-status-text " + level.cssClass;
      }
      await renderModule(row);
    }

    await waitForMs(200);
    const overallMsg =
      minHealth >= 60
        ? "✅ Ship systems check complete. All systems operational"
        : "⚠ Ship systems check complete. Some systems require attention";
    addLogEntry("Ship systems check: min health " + minHealth + "%");
    showModuleResult(
      "system-monitor",
      overallMsg,
      minHealth >= 60 ? "success" : "warning",
    );
    completeModule("system-monitor");
  });
}
