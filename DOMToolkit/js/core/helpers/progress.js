'use strict';

const completedModules = new Set();
const completedWarnings = new Set();

function addLogEntry(text) {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    const logList = document.querySelector('#mission-log-list');
    if (!logList) { return; }

    const li = createEl('li', 'log-entry');
    li.innerHTML = '<span class="log-time">' + time + '</span> ' + escapeHtml(text);
    logList.appendChild(li);

    const logContainer = document.querySelector('#mission-log');
    if (logContainer) { logContainer.scrollTop = logContainer.scrollHeight; }

    updateStatistics();
}

function showModuleResult(moduleId, message, type) {
    const container = document.querySelector('#' + moduleId + '-result');
    if (!container) { return; }
    container.innerHTML = '';
    const msgEl = createEl('div', 'result-message ' + (type || 'success'), message);
    container.appendChild(msgEl);

    if (type === 'warning') { completedWarnings.add(moduleId); }
    updateStatistics();
}

function completeModule(moduleId) {
    if (completedModules.has(moduleId)) { return; }
    completedModules.add(moduleId);

    const checkEl = document.querySelector('#step-check-' + moduleId);
    if (checkEl) { checkEl.textContent = '✅'; }

    const stepEl = checkEl ? checkEl.closest('.progress-step') : null;
    if (stepEl) { stepEl.classList.add('completed'); }

    const tabBtn = document.querySelector('[data-tab="' + moduleId + '"]');
    if (tabBtn) { tabBtn.classList.add('completed'); }

    const panelEl = document.querySelector('[data-module="' + moduleId + '"]');
    if (panelEl) { panelEl.classList.add('completed'); }

    updateProgressBar();
    updateStatistics();
}

function updateProgressBar() {
    const count = completedModules.size;
    const percent = Math.round((count / TOTAL_MODULES) * 100);

    const fillEl = document.querySelector('#progress-fill');
    const percentEl = document.querySelector('#progress-percent');

    if (fillEl) { fillEl.style.width = percent + '%'; }
    if (percentEl) { percentEl.textContent = percent + '% — ' + count + ' / ' + TOTAL_MODULES + ' modules complete'; }

    if (count === TOTAL_MODULES) {
        const banner = document.querySelector('#mission-ready-banner');
        if (banner) { banner.classList.add('visible'); }
    }
}

function updateStatistics() {
    const modulesEl = document.querySelector('#stat-modules');
    const warningsEl = document.querySelector('#stat-warnings');
    const readyEl = document.querySelector('#stat-ready');

    if (modulesEl) { modulesEl.textContent = completedModules.size; }
    if (warningsEl) { warningsEl.textContent = completedWarnings.size; }
    if (readyEl) { readyEl.textContent = Math.round((completedModules.size / TOTAL_MODULES) * 100) + '%'; }
}

function setActiveStep(moduleId) {
    document.querySelectorAll('.progress-step').forEach((step) => {
        step.classList.remove('active');
    });
    const step = document.querySelector('.progress-step[data-step="' + moduleId + '"]');
    if (step) { step.classList.add('active'); }
}
