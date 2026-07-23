'use strict';

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

function createEl(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) { element.className = className; }
    if (innerHTML !== undefined) { element.innerHTML = innerHTML; }
    return element;
}

function waitForMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderModule(element) {
    element.classList.remove('reveal');
    void element.offsetWidth;
    element.classList.add('reveal');
}

async function animateDots(element, baseText, totalMs) {
    const interval = 300;
    const steps = Math.floor(totalMs / interval);
    for (let i = 0; i <= steps; i++) {
        const dots = '.'.repeat((i % 3) + 1);
        element.textContent = baseText + dots;
        await waitForMs(interval);
    }
}
