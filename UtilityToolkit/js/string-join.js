'use strict';

function joinStrings(strings, separator, options = {}) {
  if (!Array.isArray(strings) || strings.length === 0) {
    return { error: 'No strings provided' };
  }

  const {
    trim = false,
    dedupe = true,
    sort = false,
    reverse = false,
    ignoreEmpty = true,
  } = options;

  let processed = [...strings];

  if (trim) {
    processed = processed.map((s) => s.trim());
  }

  if (ignoreEmpty) {
    processed = processed.filter((s) => s.length > 0);
  }

  if (dedupe) {
    processed = processed.filter((item, index, self) => self.indexOf(item) === index);
  }

  if (sort) {
    processed.sort((a, b) => a.localeCompare(b));
  }

  if (reverse) {
    processed.reverse();
  }

  return {
    result: processed.join(separator),
    originalCount: strings.length,
    filteredCount: processed.length,
    items: processed,
  };
}

function getSelectedOptions() {
  const selected = [];
  $('#t6-options option:selected').each(function () {
    selected.push($(this).val());
  });
  return selected;
}

function joinAndDisplay() {
  const $input = $('#t6-input');
  const rawText = $input.val();
  const separator = $('#t6-separator').val();
  const optionsList = getSelectedOptions();

  const strings = rawText.split('\n');

  const options = {
    trim: optionsList.includes('trim'),
    dedupe: optionsList.includes('dedupe'),
    sort: optionsList.includes('sort'),
    reverse: optionsList.includes('reverse'),
    ignoreEmpty: optionsList.includes('ignore-empty'),
  };

  const result = joinStrings(strings, separator, options);

  if (result.error) {
    showError($('#t6-result'), result.error);
    return;
  }

  let html = `<span class="value highlight">${escapeHtml(result.result)}</span>`;
  html += `<br><span style="font-size:12px;color:#7a6a9a;">`;
  html += `${result.originalCount} strings \u2192 ${result.filteredCount} after processing`;
  html += `</span>`;

  if (result.items.length > 0 && result.items.length <= 20) {
    html += `<br><span style="font-size:12px;color:#7a6a9a;">`;
    html += `[ ${result.items.map((item) => `"${escapeHtml(item)}"`).join(', ')} ]`;
    html += `</span>`;
  }

  showResult($('#t6-result'), {
    value: html,
  });
}

$(() => {
  const $input = $('#t6-input');

  $('#t6-join').on('click', joinAndDisplay);

  $input.on('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      joinAndDisplay();
    }
  });
});
