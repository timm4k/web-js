'use strict';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegex(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showResult($container, { success = true, label, value } = {}) {
  const statusClass = success ? 'success' : 'error';

  $container
    .removeClass('success error')
    .addClass(statusClass)
    .html(
      label
        ? `<span class="label">${escapeHtml(label)}</span><span class="value">${value}</span>`
        : `<span class="value">${value}</span>`
    );
}

function showError($container, message) {
  showResult($container, { success: false, label: 'Error', value: message });
}
