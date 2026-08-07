"use strict";

window.WebDataApp = (() => {
  const completedTasks = new Set();
  const updateProgress = () => {
    const count = completedTasks.size;
    DOMHelper.query(".progress-label").textContent =
      `${count} / ${AppConstants.TOTAL_TASKS} scenarios`;
    DOMHelper.query(".progress__fill").style.width =
      `${(count / AppConstants.TOTAL_TASKS) * 100}%`;
    DOMHelper.query(".progress").setAttribute("aria-valuenow", String(count));
  };
  const selectTab = (button) => {
    const targetId = button.dataset.tab;
    DOMHelper.queryAll(".tab").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle(UIConstants.ACTIVE, active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    DOMHelper.queryAll(".tab-panel").forEach((panel) => {
      const active = panel.id === targetId;
      panel.classList.toggle(UIConstants.ACTIVE, active);
      panel.hidden = !active;
    });
  };
  const handleTabClick = (event) => {
    const button = event.target.closest(".tab");
    if (button) selectTab(button);
  };
  const handleTabKeydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = DOMHelper.queryAll(".tab");
    const current = event.target.closest(".tab");
    if (!current) return;
    event.preventDefault();
    let index = tabs.indexOf(current);
    if (event.key === "Home") index = 0;
    else if (event.key === "End") index = tabs.length - 1;
    else
      index =
        (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
        tabs.length;
    tabs[index].focus();
    selectTab(tabs[index]);
  };
  const handleCompletion = (event) => {
    const { taskId } = event.detail;
    if (completedTasks.has(taskId)) return;
    completedTasks.add(taskId);
    const card = DOMHelper.getTaskView(taskId).card;
    card.classList.add(UIConstants.COMPLETED);
    updateProgress();
    UI.toast(`Scenario complete · ${DOMHelper.query("h3", card).textContent}`);
  };
  const init = () => {
    DOMHelper.query(".tabs").addEventListener("click", handleTabClick);
    DOMHelper.query(".tabs").addEventListener("keydown", handleTabKeydown);
    document.addEventListener(
      AppConstants.EVENT_TASK_COMPLETE,
      handleCompletion,
    );
    document.addEventListener("submit", (event) => event.preventDefault());
    window.WebTasks.forEach((task) => task.init());
    updateProgress();
  };
  return Object.freeze({ init });
})();

document.addEventListener("DOMContentLoaded", window.WebDataApp.init);
