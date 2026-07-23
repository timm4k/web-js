'use strict';

function switchTab(moduleId) {
    document.querySelectorAll('.tab-content').forEach((c) => { c.classList.remove('active'); });
    document.querySelectorAll('.tab-btn').forEach((b) => { b.classList.remove('active'); });
    const target = document.getElementById(moduleId);
    if (target) { target.classList.add('active'); }
    const activeBtn = document.querySelector('[data-tab="' + moduleId + '"]');
    if (activeBtn) { activeBtn.classList.add('active'); }
    setActiveStep(moduleId);
}

function initTabListeners() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => { switchTab(btn.getAttribute('data-tab')); });
    });
    document.querySelectorAll('.progress-step').forEach((step) => {
        step.addEventListener('click', () => { switchTab(step.getAttribute('data-step')); });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTabListeners();
    initObjectCard();
    initMissionStatus();
    initBonusGenerator();
    initEnergyModules();
    initCommunicationChannels();
    initOrbitalModules();
    initPlanetRating();
    initExpeditionTags();
    initSystemMonitor();
});
