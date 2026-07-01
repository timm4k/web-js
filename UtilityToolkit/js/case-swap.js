'use strict';

const T3_RANDOM_EXAMPLES = [
  'Hello user',
  'Lemme show u how 2 move, lemme show u how 2...',
  'I wanna see the whole workd put 100 stamps on my passposrttttt',
];

function swapCase(text) {
  let result = '';

  for (const char of text) {
    if (/[\p{Nd}]/u.test(char)) {
      result += '_';
    } else if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      result += char.toLowerCase();
    } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
      result += char.toUpperCase();
    } else {
      result += char;
    }
  }

  return result;
}

function convertToKebabCase(text) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function convertToSnakeCase(text) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^\w]/g, '_')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function convertToCamelCase(text) {
  const cleaned = text
    .replace(/[-_\s]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();

  return cleaned
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

function processSwapCase() {
  const $input = $('#t3-input');
  const text = $input.val();
  const result = swapCase(text);

  showResult($('#t3-result'), {
    label: 'Swapped case (upper\u2194lower, digits\u2192_)',
    value: `<span style="color:#50ff96;">${escapeHtml(result)}</span>`,
  });
}

function processKebabCase() {
  const $input = $('#t3-input');
  const text = $input.val();
  const result = convertToKebabCase(text);

  showResult($('#t3-result'), {
    label: 'kebab-case',
    value: `<span style="color:#50ff96;">${escapeHtml(result)}</span>`,
  });
}

function processSnakeCase() {
  const $input = $('#t3-input');
  const text = $input.val();
  const result = convertToSnakeCase(text);

  showResult($('#t3-result'), {
    label: 'snake_case',
    value: `<span style="color:#50ff96;">${escapeHtml(result)}</span>`,
  });
}

function processCamelCase() {
  const $input = $('#t3-input');
  const text = $input.val();
  const result = convertToCamelCase(text);

  showResult($('#t3-result'), {
    label: 'camelCase',
    value: `<span style="color:#50ff96;">${escapeHtml(result)}</span>`,
  });
}

function randomT3Example() {
  const index = Math.floor(Math.random() * T3_RANDOM_EXAMPLES.length);
  $('#t3-input').val(T3_RANDOM_EXAMPLES[index]);
  processSwapCase();
}

$(() => {
  const $input = $('#t3-input');

  $('#t3-convert').on('click', processSwapCase);
  $('#t3-to-kebab').on('click', processKebabCase);
  $('#t3-to-snake').on('click', processSnakeCase);
  $('#t3-to-camel').on('click', processCamelCase);
  $('#t3-random').on('click', randomT3Example);

  $input.on('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      processSwapCase();
    }
  });
});
