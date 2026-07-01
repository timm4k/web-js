'use strict';

const T4_BATCH_EXAMPLES = [
  'font-size',
  'background-color',
  'text-align',
  'border-radius',
  'margin-left',
  'padding-top',
  'box-shadow',
  'z-index',
  'line-height',
  'letter-spacing',
];

function cssKebabToCamelCase(cssProperty) {
  return cssProperty.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function camelCaseToCssKebab(camelCase) {
  return camelCase.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function kebabToCamel() {
  const $input = $('#t4-input');
  const cssProperty = $input.val().trim();

  if (!cssProperty) {
    showError($('#t4-result'), 'Enter a CSS property name');
    return;
  }

  const camelCaseResult = cssKebabToCamelCase(cssProperty);

  showResult($('#t4-result'), {
    label: 'kebab \u2192 camelCase',
    value: `<span style="color:#50ff96;">${escapeHtml(camelCaseResult)}</span>
            <br><span style="font-size:12px;color:#7a6a9a;">${escapeHtml(cssProperty)} \u2192 ${escapeHtml(camelCaseResult)}</span>`,
  });
}

function camelToKebab() {
  const $input = $('#t4-input');
  const text = $input.val().trim();

  if (!text) {
    showError($('#t4-result'), 'Enter a camelCase property name');
    return;
  }

  const kebabResult = camelCaseToCssKebab(text);

  showResult($('#t4-result'), {
    label: 'camelCase \u2192 kebab',
    value: `<span style="color:#50ff96;">${escapeHtml(kebabResult)}</span>
            <br><span style="font-size:12px;color:#7a6a9a;">${escapeHtml(text)} \u2192 ${escapeHtml(kebabResult)}</span>`,
  });
}

function batchConvert() {
  const results = T4_BATCH_EXAMPLES.map((cssProperty) => ({
    original: cssProperty,
    camelCase: cssKebabToCamelCase(cssProperty),
  }));

  const rows = results
    .map(
      ({ original, camelCase }) =>
        `<tr>
          <td><code>${escapeHtml(original)}</code></td>
          <td><span style="color:#50ff96;">\u2192</span></td>
          <td><code>${escapeHtml(camelCase)}</code></td>
        </tr>`
    )
    .join('');

  showResult($('#t4-result'), {
    label: 'Batch conversion (common CSS properties)',
    value: `
      <table style="margin-top:4px;">
        <thead>
          <tr>
            <th style="padding:6px 10px;font-size:12px;">kebab-case</th>
            <th style="padding:6px 10px;font-size:12px;"></th>
            <th style="padding:6px 10px;font-size:12px;">camelCase</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`,
  });
}

function randomT4Example() {
  const index = Math.floor(Math.random() * T4_BATCH_EXAMPLES.length);
  $('#t4-input').val(T4_BATCH_EXAMPLES[index]);
  kebabToCamel();
}

$(() => {
  const $input = $('#t4-input');

  $('#t4-to-camel').on('click', kebabToCamel);
  $('#t4-to-kebab').on('click', camelToKebab);
  $('#t4-batch').on('click', batchConvert);
  $('#t4-random').on('click', randomT4Example);

  $input.on('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      kebabToCamel();
    }
  });
});
