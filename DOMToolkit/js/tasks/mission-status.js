"use strict";

let currentStatusIndex = 0;

function initMissionStatus() {
  const btn = document.querySelector("#toggle-status-btn");
  if (!btn) {
    return;
  }

  const display = document.querySelector("#mission-status-display");

  btn.addEventListener("click", async () => {
    if (!display) {
      return;
    }

    currentStatusIndex = (currentStatusIndex + 1) % STATUS_CYCLE.length;
    const rawStatus = STATUS_CYCLE[currentStatusIndex];
    const config = STATUS_CONFIG[rawStatus];

    display.className = "mission-status-display " + config.cssClass;
    display.innerHTML =
      '<span class="status-icon">' +
      config.icon +
      "</span>" +
      '<span class="status-text">' +
      config.text +
      "</span>" +
      '<span class="status-label">Current: ' +
      rawStatus +
      "</span>";
    await renderModule(display);

    if (rawStatus === "Active") {
      btn.textContent = "Communication Established";
    } else if (rawStatus === "Offline") {
      btn.textContent = "Synchronize Mission Status";
    }

    await waitForMs(300);
    addLogEntry("Mission status: " + rawStatus);
    showModuleResult(
      "mission-status",
      "✅ Mission status synchronized. Current: " + rawStatus,
    );
    completeModule("mission-status");
  });
}
