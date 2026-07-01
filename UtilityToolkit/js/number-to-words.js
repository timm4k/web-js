'use strict';

function convertNumberToWords(number) {
  const num = Math.floor(Math.abs(number));

  if (num < 1 || num > 999) {
    return { error: 'Number must be between 1 and 999' };
  }

  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  const tens = Math.floor(remainder / 10);
  const units = remainder % 10;

  const parts = [];

  if (hundreds > 0) {
    parts.push(NUMBER_WORDS.hundreds[hundreds]);
  }

  if (remainder >= 10 && remainder <= 19) {
    parts.push(NUMBER_WORDS.teens[remainder - 10]);
  } else {
    if (tens >= 2) {
      parts.push(NUMBER_WORDS.tens[tens]);
    }
    if (units > 0) {
      parts.push(NUMBER_WORDS.units[units]);
    }
  }

  return { words: parts.join(' '), number: num };
}

function getNumberDescription(number) {
  const num = Math.floor(Math.abs(number));
  if (num < 1 || num > 999) return null;

  const isEven = num % 2 === 0;
  const isPrime = (function (n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  })(num);

  const sqrt = Math.sqrt(num).toFixed(4);
  const square = num * num;
  const cube = num * num * num;

  return { isEven, isPrime, sqrt, square, cube };
}

function convertAndDisplay() {
  const $input = $('#t2-input');
  const rawValue = $input.val().trim();
  const number = parseInt(rawValue, 10);

  if (Number.isNaN(number) || number < 1 || number > 999) {
    showError($('#t2-result'), 'Enter a valid number between 1 and 999');
    return;
  }

  const result = convertNumberToWords(number);

  if (result.error) {
    showError($('#t2-result'), result.error);
    return;
  }

  const description = getNumberDescription(number);

  let detailsHtml = `<span class="value highlight">${result.words}</span>`;
  detailsHtml += `<br><span style="font-size:12px;color:#7a6a9a;">${number} → ${result.words}</span>`;

  if (description) {
    const traits = [
      description.isEven ? 'even' : 'odd',
      description.isPrime ? 'prime' : 'composite',
    ];
    detailsHtml += `<br><span style="font-size:12px;color:#7a6a9a;">`;
    detailsHtml += `Properties: ${traits.join(', ')} &middot; `;
    detailsHtml += `${number}² = ${description.square} &middot; `;
    detailsHtml += `${number}³ = ${description.cube} &middot; `;
    detailsHtml += `√${number} = ${description.sqrt}`;
    detailsHtml += `</span>`;
  }

  showResult($('#t2-result'), {
    value: detailsHtml,
  });
}

$(() => {
  const $input = $('#t2-input');
  const $convertBtn = $('#t2-convert');

  $convertBtn.on('click', convertAndDisplay);

  $input.on('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      convertAndDisplay();
    }
  });

  $('#t2-random').on('click', () => {
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    $input.val(randomNumber);
    convertAndDisplay();
  });
});
