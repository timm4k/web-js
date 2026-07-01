'use strict';

const CALC_KEY_MAP = Object.freeze({
  '\u00d7': '*',
  '\u00f7': '/',
  '\u2212': '-',
});

function normalizeExpression(expression) {
  return expression
    .replace(/\u00d7/g, '*')
    .replace(/\u00f7/g, '/')
    .replace(/\u2212/g, '-')
    .replace(/\s/g, '');
}

function toDisplayFormat(expr) {
  return expr.replace(/\*/g, '\u00d7').replace(/\//g, '\u00f7');
}

function tokenize(expression) {
  const tokens = [];
  let currentNumber = '';
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    if (/[\d.]/.test(char)) {
      currentNumber += char;
    } else if ('+-*/()%'.includes(char)) {
      if (currentNumber) {
        tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        currentNumber = '';
      }

      if (char === '-' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'operator' || tokens[tokens.length - 1].value === '(')) {
        currentNumber = '-';
      } else {
        tokens.push({ type: 'operator', value: char });
      }
    } else {
      if (currentNumber) {
        tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        currentNumber = '';
      }
    }
    i++;
  }

  if (currentNumber) {
    tokens.push({ type: 'number', value: parseFloat(currentNumber) });
  }

  return tokens;
}

function applyOperator(operator, right, left) {
  switch (operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/':
      if (right === 0) throw new Error('Division by zero');
      return left / right;
    case '%': return left % right;
    default: throw new Error(`Unknown operator: ${operator}`);
  }
}

function evaluateExpression(expression) {
  const normalized = normalizeExpression(expression);

  if (!normalized) {
    return { error: 'Enter an expression' };
  }

  if (/[^0-9+\-*/().%]/.test(normalized.replace(/^[+\-*/]*/, ''))) {
    return { error: 'Expression contains invalid characters' };
  }

  try {
    const tokens = tokenize(normalized);

    if (tokens.length === 0) {
      return { error: 'Empty expression' };
    }

    const outputQueue = [];
    const operatorStack = [];

    for (const token of tokens) {
      if (token.type === 'number') {
        outputQueue.push(token.value);
      } else if (token.value === '(') {
        operatorStack.push(token);
      } else if (token.value === ')') {
        let foundLeftParen = false;
        while (operatorStack.length > 0) {
          const op = operatorStack.pop();
          if (op.value === '(') {
            foundLeftParen = true;
            break;
          }
          const right = outputQueue.pop();
          const left = outputQueue.pop();
          outputQueue.push(applyOperator(op.value, right, left));
        }
        if (!foundLeftParen) {
          return { error: 'Mismatched parentheses' };
        }
      } else if (['+', '-', '*', '/', '%'].includes(token.value)) {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].value !== '(' &&
          PRIORITY_SYMBOLS[operatorStack[operatorStack.length - 1].value] >= PRIORITY_SYMBOLS[token.value]
        ) {
          const op = operatorStack.pop();
          const right = outputQueue.pop();
          const left = outputQueue.pop();
          outputQueue.push(applyOperator(op.value, right, left));
        }
        operatorStack.push(token);
      }
    }

    while (operatorStack.length > 0) {
      const op = operatorStack.pop();
      if (op.value === '(') {
        return { error: 'Mismatched parentheses' };
      }
      const right = outputQueue.pop();
      const left = outputQueue.pop();
      outputQueue.push(applyOperator(op.value, right, left));
    }

    if (outputQueue.length !== 1) {
      return { error: 'Invalid expression' };
    }

    const result = outputQueue[0];

    if (!Number.isFinite(result)) {
      return { error: 'Result is not finite (overflow or division by zero)' };
    }

    let formattedResult;
    if (Number.isInteger(result)) {
      formattedResult = result.toString();
    } else {
      formattedResult = parseFloat(result.toFixed(10)).toString();
    }

    return { result: formattedResult, isInteger: Number.isInteger(result) };
  } catch (error) {
    return { error: error.message || 'Calculation error' };
  }
}

function calculateAndDisplay() {
  const $input = $('#t7-input');
  const expression = $input.val().trim();

  const result = evaluateExpression(expression);

  if (result.error) {
    showError($('#t7-result'), result.error);
    $('#t7-display').text(`${expression} = error`);
    $('#t7-preview').text(result.error).css('color', '#ff6060');
    return;
  }

  const displayExpr = toDisplayFormat(expression);

  $('#t7-display').text(`${displayExpr} = ${result.result}`);
  $('#t7-preview').text(`= ${result.result}`).css('color', '#50ff96');

  showResult($('#t7-result'), {
    label: `${expression} =`,
    value: `<span class="value highlight">${result.result}</span>`,
    highlight: true,
  });
}

function handleKeypadInput(value) {
  const $input = $('#t7-input');

  if (value === 'clear') {
    $input.val('');
    $('#t7-result').html('<span class="value">Expression cleared</span>');
    $('#t7-display').text('');
    $('#t7-preview').text('\u00A0').css('color', '#7a6a9a');
    return;
  }

  if (value === '=') {
    calculateAndDisplay();
    return;
  }

  const key = CALC_KEY_MAP[value] || value;
  const currentValue = $input.val();
  $input.val(currentValue + key);
  $input.focus();

  const displayValue = toDisplayFormat($input.val());

  $('#t7-display').text(displayValue || '\u00A0');
  $('#t7-preview').text('\u00A0').css('color', '#7a6a9a');
}

$(() => {
  const $input = $('#t7-input');

  $('#t7-result').on('click', calculateAndDisplay);

  $input.on('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateAndDisplay();
    }
  });

  $input.on('input', function () {
    const displayValue = toDisplayFormat($(this).val());
    $('#t7-display').text(displayValue || '\u00A0');
    $('#t7-preview').text('\u00A0').css('color', '#7a6a9a');
  });

  $('.calc-btn').on('click', function () {
    const value = $(this).data('calc');
    handleKeypadInput(value);
  });
});
