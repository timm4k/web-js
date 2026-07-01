"use strict";

const T1_TEST_STRINGS = [
  "Hello hai oiii hai",
  "Lemme show u how to move, lemme show u how to...",
  "I wanna see the whole workd put some stamps on my passposrttttt",
];

function getCharacterCategories(text) {
  const categories = {
    letters: 0,
    digits: 0,
    whitespace: 0,
    punctuation: 0,
    other: 0,
  };

  for (const char of text) {
    const code = char.codePointAt(0);

    if (/[\p{L}]/u.test(char)) {
      categories.letters++;
    } else if (/[\p{Nd}]/u.test(char)) {
      categories.digits++;
    } else if (/\s/.test(char)) {
      categories.whitespace++;
    } else if (/[\p{P}\p{S}]/u.test(char)) {
      categories.punctuation++;
    } else {
      categories.other++;
    }
  }

  return categories;
}

function getCharacterFrequency(text) {
  const frequency = {};

  for (const char of text) {
    if (/\s/.test(char)) continue;
    const lower = char.toLowerCase();
    frequency[lower] = (frequency[lower] || 0) + 1;
  }

  return Object.entries(frequency)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 15);
}

function getStringStatistics(text) {
  const categories = getCharacterCategories(text);
  const total = text.length;
  const lettersPercent =
    total > 0 ? ((categories.letters / total) * 100).toFixed(1) : 0;
  const digitsPercent =
    total > 0 ? ((categories.digits / total) * 100).toFixed(1) : 0;

  const uppers = [...text].filter((char) => /[\p{Lu}]/u.test(char)).length;
  const lowers = [...text].filter((char) => /[\p{Ll}]/u.test(char)).length;
  const vowels = [...text].filter((char) => /[aeiou]/i.test(char)).length;
  const consonants = categories.letters - vowels;

  const words = text.trim() ? text.trim().split(/[\s]+/).length : 0;

  const uniqueChars = new Set([...text].filter((char) => !/\s/.test(char)))
    .size;

  return {
    ...categories,
    total,
    lettersPercent,
    digitsPercent,
    uppers,
    lowers,
    vowels,
    consonants,
    words,
    uniqueChars,
  };
}

function renderStats($container, stats) {
  const items = [
    { value: stats.total, label: "Total chars" },
    { value: stats.letters, label: `Letters (${stats.lettersPercent}%)` },
    { value: stats.digits, label: `Digits (${stats.digitsPercent}%)` },
    { value: stats.whitespace, label: "Whitespace" },
    { value: stats.punctuation, label: "Punctuation" },
    { value: stats.uppers, label: "UpperCase" },
    { value: stats.lowers, label: "LowerCase" },
    { value: stats.vowels, label: "Vowels" },
    { value: stats.consonants, label: "Consonants" },
    { value: stats.words, label: "Words" },
    { value: stats.uniqueChars, label: "Unique chars" },
    { value: stats.other, label: "Other symbols" },
  ];

  const html = items
    .map(
      ({ value, label }) =>
        `<div class="stat-item"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`,
    )
    .join("");

  $container.html(html);
}

function renderFrequencyChart($container, frequency) {
  if (frequency.length === 0) {
    $container.empty();
    return;
  }

  const maxCount = frequency[0][1];

  const html = frequency
    .map(([char, count]) => {
      const widthPercent = (count / maxCount) * 100;
      const displayChar = char === " " ? "\u2423" : char;
      return `
        <div class="frequency-bar-container">
          <span class="frequency-bar-label">${escapeHtml(displayChar)}</span>
          <div class="frequency-bar-track">
            <div class="frequency-bar-fill" style="width: ${widthPercent}%"></div>
          </div>
          <span class="frequency-bar-count">${count}</span>
        </div>`;
    })
    .join("");

  $container.html(
    `<div style="margin-top:12px;font-size:11px;color:#7a6a9a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Character frequency (top 15)</div>${html}`,
  );
}

function analyzeString() {
  const $input = $("#t1-input");
  const text = $input.val();

  const stats = getStringStatistics(text);
  const frequency = getCharacterFrequency(text);

  renderStats($("#t1-stats"), stats);
  renderFrequencyChart($("#t1-frequency"), frequency);

  const summaryHtml =
    `"${escapeHtml(text.length > 50 ? `${text.slice(0, 50)}\u2026` : text)}" \u2014 ` +
    `${stats.letters} letters, ${stats.digits} digits, ${stats.whitespace} whitespace, ` +
    `${stats.punctuation} punctuation, ${stats.other} other`;

  showResult($("#t1-result"), {
    label: "Summary",
    value: summaryHtml,
  });
}

$(() => {
  const $input = $("#t1-input");
  const $analyzeBtn = $("#t1-analyze");

  $analyzeBtn.on("click", analyzeString);

  $input.on("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      analyzeString();
    }
  });

  $("#t1-random").on("click", () => {
    const randomIndex = Math.floor(Math.random() * T1_TEST_STRINGS.length);
    $input.val(T1_TEST_STRINGS[randomIndex]);
    analyzeString();
  });
});
