"use strict";

const T10_EXAMPLES = [
  {
    template: "Today is %1 %2.%3.%4",
    params: ["Monday", "10", "8", "2026"],
    description: "Date format",
  },
  {
    template: "Hello, %1! You are %2 years old and live in %3.",
    params: ["Jotaro", "18", "Japan"],
    description: "Personal info",
  },
  {
    template: '%1 says: "%2" and repeats "%1 %1 %1"',
    params: ["Hello hai oiii hai", "Lemme show u how to move..."],
    description: "Repeat placeholder",
  },
  {
    template: 'Phrase 1: "%1" | Phrase 2: "%2" | Phrase 3: "%3"',
    params: [
      "Hello hai oiii hai",
      "Lemme show u how to move, lemme show u how to...",
      "I wanna see the whole workd put some stamps on my passposrttttt",
    ],
    description: "Multiple task1 phrases",
  },
  {
    template: "%1 + %2 = %3",
    params: ["2", "3", "5"],
    description: "Math expression",
  },
];

function renderTemplate(template, parameters) {
  if (!template) {
    return { error: "Template cannot be empty" };
  }

  if (!Array.isArray(parameters) || parameters.length === 0) {
    return { error: "No parameters provided" };
  }

  let result = template;

  for (let i = 0; i < parameters.length; i++) {
    const placeholderIndex = i + 1;
    const placeholder = new RegExp(`%${placeholderIndex}\\b`, "g");
    const replaced = result.replace(placeholder, () => String(parameters[i]));

    if (replaced === result) {
      const simplePlaceholder = `%${placeholderIndex}`;
      result = result.replace(
        new RegExp(escapeRegex(simplePlaceholder), "g"),
        () => String(parameters[i]),
      );
    } else {
      result = replaced;
    }
  }

  result = result.replace(/%\d+/g, (match) => {
    const index = parseInt(match.slice(1), 10) - 1;
    if (index >= 0 && index < parameters.length) {
      return `<span style="color:#ff6060;">[missing: ${match}]</span>`;
    }
    return `<span style="color:#ff6060;">[undefined: ${match}]</span>`;
  });

  return {
    result,
    template,
    parameters: [...parameters],
    parameterCount: parameters.length,
  };
}

function renderAndDisplay() {
  const $template = $("#t10-template");
  const $params = $("#t10-params");

  const template = $template.val();
  const paramsRaw = $params.val();
  const parameters = paramsRaw
    .split("\n")
    .filter((line) => line.trim() !== "" || paramsRaw.includes("\n"));

  const result = renderTemplate(template, parameters);

  if (result.error) {
    showError($("#t10-result"), result.error);
    return;
  }

  let html = `<div class="value highlight" style="font-size:18px;padding:12px 0;">`;
  html += result.result;
  html += `</div>`;
  html += `<div style="font-size:12px;color:#7a6a9a;margin-top:8px;">`;
  html += `Template: <code>${escapeHtml(template)}</code><br>`;
  html += `Parameters: `;
  html += result.parameters
    .map(
      (param, index) =>
        `<span class="tag">%${index + 1}=${escapeHtml(param)}</span>`,
    )
    .join(" ");
  html += `</div>`;

  showResult($("#t10-result"), {
    value: html,
  });
}

function loadExample(index) {
  const example = T10_EXAMPLES[index];
  $("#t10-template").val(example.template);
  $("#t10-params").val(example.params.join("\n"));
  renderAndDisplay();
}

$(() => {
  const $template = $("#t10-template");

  $("#t10-render").on("click", renderAndDisplay);
  $("#t10-example1").on("click", () => loadExample(0));
  $("#t10-example2").on("click", () => loadExample(1));
  $("#t10-example3").on("click", () => loadExample(2));
  $("#t10-example4").on("click", () => loadExample(3));

  $template.on("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      renderAndDisplay();
    }
  });

  $("#t10-params").on("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      renderAndDisplay();
    }
  });
});
