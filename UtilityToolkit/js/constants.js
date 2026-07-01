'use strict';

const NUMBER_WORDS = Object.freeze({
  units: [
    '', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine',
  ],
  teens: [
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
  ],
  tens: [
    '', '', 'twenty', 'thirty', 'forty', 'fifty',
    'sixty', 'seventy', 'eighty', 'ninety',
  ],
  hundreds: [
    '', 'one hundred', 'two hundred', 'three hundred', 'four hundred', 'five hundred',
    'six hundred', 'seven hundred', 'eight hundred', 'nine hundred',
  ],
});

const PRIORITY_SYMBOLS = Object.freeze({
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
});
