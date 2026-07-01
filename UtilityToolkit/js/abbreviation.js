'use strict';

const T5_EXAMPLES = [
  { phrase: 'cascading style sheets', lang: 'en' },
  { phrase: 'object oriented programming', lang: 'en' },
  { phrase: 'hyper text markup language', lang: 'en' },
  { phrase: 'application programming interface', lang: 'en' },
  { phrase: 'as soon as possible', lang: 'en' },
  { phrase: 'javascript object notation', lang: 'en' },
  { phrase: 'light emitting diode', lang: 'en' },
  { phrase: 'do it yourself', lang: 'en' },
  { phrase: 'graphical user interface', lang: 'en' },
  { phrase: 'central processing unit', lang: 'en' },
  { phrase: 'world wide web', lang: 'en' },
  { phrase: 'artificial intelligence', lang: 'en' },
];

const STOP_WORDS = new Set(['the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'but', 'by', 'with']);

function createAbbreviation(phrase, options = {}) {
  const { uppercase = true, removeStopWords = false } = options;

  if (!phrase || !phrase.trim()) {
    return { error: 'Enter a phrase' };
  }

  const words = phrase.trim().split(/[\s\-_]+/);

  const filteredWords = removeStopWords
    ? words.filter((word) => {
        const lower = word.toLowerCase();
        return !STOP_WORDS.has(lower);
      })
    : words;

  if (filteredWords.length === 0) {
    return { error: 'No words to abbreviate (all are stop words)' };
  }

  const abbreviation = filteredWords
    .map((word) => {
      const firstChar = word.charAt(0);
      return /[\p{L}]/u.test(firstChar) ? firstChar : '';
    })
    .filter(Boolean)
    .join('');

  const result = uppercase ? abbreviation.toUpperCase() : abbreviation.toUpperCase();

  if (!result) {
    return { error: 'Could not create abbreviation \u2014 no letters found' };
  }

  return {
    abbreviation: result,
    original: phrase,
    wordCount: words.length,
    filteredCount: filteredWords.length,
    words: filteredWords,
  };
}

function abbreviatePhrase() {
  const $input = $('#t5-input');
  const phrase = $input.val();

  const result = createAbbreviation(phrase, { uppercase: true, removeStopWords: false });

  if (result.error) {
    showError($('#t5-result'), result.error);
    return;
  }

  let html = `<span class="value highlight">${escapeHtml(result.abbreviation)}</span>`;
  html += `<br><span style="font-size:12px;color:#7a6a9a;">`;
  html += `${escapeHtml(result.original)} \u2192 ${result.wordCount} words`;
  if (result.filteredCount !== result.wordCount) {
    html += ` (${result.filteredCount} after stop word removal)`;
  }
  html += ` \u2192 <strong>${escapeHtml(result.abbreviation)}</strong>`;
  html += `</span>`;

  if (result.words.length > 0) {
    html += `<br><span style="font-size:12px;color:#7a6a9a;">`;
    html += result.words
      .map((w) => {
        const initial = /[\p{L}]/u.test(w.charAt(0)) ? w.charAt(0).toUpperCase() : '?';
        return `${escapeHtml(w)} <span style="color:#b366ff;">[${initial}]</span>`;
      })
      .join(' + ');
    html += `</span>`;
  }

  showResult($('#t5-result'), {
    value: html,
  });
}

function randomExample() {
  const index = Math.floor(Math.random() * T5_EXAMPLES.length);
  const example = T5_EXAMPLES[index];
  $('#t5-input').val(example.phrase);
  abbreviatePhrase();
}

$(() => {
  const $input = $('#t5-input');

  $('#t5-convert').on('click', abbreviatePhrase);
  $('#t5-random').on('click', randomExample);

  $input.on('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      abbreviatePhrase();
    }
  });
});
