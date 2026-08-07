"use strict";

window.FormEventHandling = (() => {
  const completedTasks = new Set();
  const updateProgress = () => {
    const count = completedTasks.size;
    DOMHelper.query(".progress-label").textContent =
      `${count} / ${AppConstants.TOTAL_TASKS} protocols`;
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
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const tabs = DOMHelper.queryAll(".tab");
    const current = event.target.closest(".tab");
    if (!current) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next =
      tabs[(tabs.indexOf(current) + direction + tabs.length) % tabs.length];
    next.focus();
    selectTab(next);
  };
  const handleCompletion = (event) => {
    const { taskId } = event.detail;
    if (completedTasks.has(taskId)) return;
    completedTasks.add(taskId);
    const card = DOMHelper.getTaskView(taskId).card;
    card.classList.add(UIConstants.COMPLETED);
    updateProgress();
    UI.toast(`Protocol complete · ${DOMHelper.query("h3", card).textContent}`);
  };
  const handleReset = (event) => {
    const button = event.target.closest('[data-action="reset"]');
    if (!button) return;
    const taskId = button.closest("[data-task-id]").dataset.taskId;
    completedTasks.delete(taskId);
    DOMHelper.getTaskView(taskId).card.classList.remove(UIConstants.COMPLETED);
    updateProgress();
  };
  const preventFormSubmit = (event) => event.preventDefault();
  const init = () => {
    DOMHelper.query(".tabs").addEventListener("click", handleTabClick);
    DOMHelper.query(".tabs").addEventListener("keydown", handleTabKeydown);
    document.addEventListener(
      AppConstants.EVENT_TASK_COMPLETE,
      handleCompletion,
    );
    document.addEventListener("click", handleReset);
    document.addEventListener("submit", preventFormSubmit);
    window.FormTasks.forEach((task) => task.init());
    updateProgress();
  };
  return Object.freeze({ init });
})();

document.addEventListener("DOMContentLoaded", window.FormEventHandling.init);
