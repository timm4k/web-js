'use strict';

function customSplit(text, separator, limit = 0) {
  if (typeof text !== 'string') {
    return { error: 'Input must be a string' };
  }

  if (separator === '' || separator === undefined || separator === null) {
    return { error: 'Separator cannot be empty' };
  }

  const parts = [];
  const sepLength = separator.length;
  let searchStart = 0;

  while (searchStart < text.length) {
    const separatorIndex = text.indexOf(separator, searchStart);

    if (separatorIndex === -1) {
      parts.push(text.slice(searchStart));
      break;
    }

    parts.push(text.slice(searchStart, separatorIndex));

    if (limit > 0 && parts.length >= limit) {
      parts.push(text.slice(separatorIndex + sepLength));
      break;
    }

    searchStart = separatorIndex + sepLength;
  }

  return {
    parts,
    count: parts.length,
  };
}

function splitAndDisplay() {
  const $input = $('#t9-input');
  const $separator = $('#t9-separator');
  const $limit = $('#t9-limit');

  const text = $input.val();
  const separator = $separator.val();
  const limit = parseInt($limit.val(), 10) || 0;

  if (!separator) {
    showError($('#t9-result'), 'Enter a separator');
    return;
  }

  const result = customSplit(text, separator, limit);

  if (result.error) {
    showError($('#t9-result'), result.error);
    $('#t9-parts').empty();
    return;
  }

  showResult($('#t9-result'), {
    label: `Split into ${result.count} part${result.count !== 1 ? 's' : ''}`,
    value: result.parts
      .map((part, index) => {
        const partNum = index + 1;
        return `<span class="tag highlight">#${partNum}</span> <code style="color:#d0c0f0;">${escapeHtml(part)}</code>`;
      })
      .join('<br>'),
  });

  const partsHtml = result.parts
    .map((part, index) => {
      const emphasis = index === 0 || index === result.parts.length - 1 ? 'color:#b366ff;' : '';
      return `<div style="padding:4px 0;font-size:13px;${emphasis}">
        <span style="color:#7a6a9a;font-size:11px;">[${index}]</span>
        <span style="font-family:'Consolas','Courier New',monospace;">${escapeHtml(part)}</span>
        <span style="color:#5a4a7a;font-size:11px;">(${part.length} chars)</span>
      </div>`;
    })
    .join('');

  $('#t9-parts').html(
    `<div style="margin-top:12px;border:1px solid rgba(179,102,255,0.1);padding:12px 16px;background:rgba(10,10,30,0.4);">
      <div style="font-size:11px;color:#7a6a9a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Result parts</div>
      ${partsHtml}
    </div>`
  );
}

$(() => {
  const $input = $('#t9-input');
  const $separator = $('#t9-separator');
  const $limit = $('#t9-limit');

  function onEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      splitAndDisplay();
    }
  }

  $('#t9-split').on('click', splitAndDisplay);

  $input.on('keydown', onEnter);
  $separator.on('keydown', onEnter);
  $limit.on('keydown', onEnter);
});
