'use strict';

const T8_EXAMPLES = [
  'https://example.com/about',
  'https://www.google.com/search?q=javascript&hl=en',
  'http://user:pass@api.example.com:8080/v1/users?page=1&limit=10#section',
  'https://en.wikipedia.org/wiki/JavaScript#History',
  'ftp://files.example.com/pub/readme.txt',
  'https://shop.example.com/products?category=electronics&sort=price&page=2',
];

function parseUrl(url) {
  if (!url || !url.trim()) {
    return { error: 'Enter a URL' };
  }

  const text = url.trim();

  let protocol = '';
  let auth = '';
  let username = '';
  let password = '';
  let hostname = '';
  let port = '';
  let path = '';
  let query = '';
  let fragment = '';
  let queryParams = [];

  const protocolMatch = text.match(/^([a-zA-Z][a-zA-Z0-9+\-.]*):\/\//);
  if (protocolMatch) {
    protocol = protocolMatch[1];
  } else {
    protocol = 'http';
  }

  const rest = protocolMatch ? text.slice(protocolMatch[0].length) : text;

  const fragmentIndex = rest.lastIndexOf('#');
  const restNoFragment = fragmentIndex >= 0 ? rest.slice(0, fragmentIndex) : rest;
  if (fragmentIndex >= 0) {
    fragment = rest.slice(fragmentIndex + 1);
  }

  const queryIndex = restNoFragment.indexOf('?');
  const restNoQuery = queryIndex >= 0 ? restNoFragment.slice(0, queryIndex) : restNoFragment;
  if (queryIndex >= 0) {
    query = restNoFragment.slice(queryIndex + 1);
    queryParams = query.split('&')
      .filter((param) => param.length > 0)
      .map((param) => {
        const eqIndex = param.indexOf('=');
        if (eqIndex >= 0) {
          return {
            key: decodeURIComponent(param.slice(0, eqIndex)),
            value: decodeURIComponent(param.slice(eqIndex + 1)),
          };
        }
        return { key: decodeURIComponent(param), value: '' };
      });
  }

  const authMatch = restNoQuery.match(/^([^@]+)@/);
  if (authMatch) {
    auth = authMatch[1];
    const colonIndex = auth.indexOf(':');
    if (colonIndex >= 0) {
      username = auth.slice(0, colonIndex);
      password = auth.slice(colonIndex + 1);
    } else {
      username = auth;
    }
  }

  const hostPortPath = authMatch ? restNoQuery.slice(authMatch[0].length) : restNoQuery;

  const portMatch = hostPortPath.match(/^([^:/]+):(\d+)/);
  if (portMatch) {
    hostname = portMatch[1];
    port = portMatch[2];
    path = hostPortPath.slice(portMatch[0].length) || '/';
  } else {
    const pathIndex = hostPortPath.indexOf('/');
    if (pathIndex >= 0) {
      hostname = hostPortPath.slice(0, pathIndex);
      path = hostPortPath.slice(pathIndex) || '/';
    } else {
      hostname = hostPortPath;
      path = '/';
    }
  }

  if (!path) path = '/';

  return {
    protocol,
    auth: username || password ? { username, password } : null,
    hostname,
    port: port || (protocol === 'https' ? '443' : protocol === 'http' ? '80' : ''),
    path,
    pathSegments: path.split('/').filter(Boolean),
    query,
    queryParams,
    fragment,
    full: text,
  };
}

function parseAndDisplay() {
  const $input = $('#t8-input');
  const url = $input.val();

  const parsed = parseUrl(url);

  if (parsed.error) {
    showError($('#t8-result'), parsed.error);
    $('#t8-details').empty();
    return;
  }

  const parts = [];
  const addPart = (label, value) => {
    const displayValue = value || '<span style="color:#5a4a7a;">\u2014</span>';
    parts.push(
      `<div class="url-part-label">${label}</div><div class="url-part-value">${displayValue}</div>`
    );
  };

  addPart('Protocol', `<span style="color:#b366ff;">${escapeHtml(parsed.protocol)}</span>`);
  addPart('Hostname', `<span style="color:#50ff96;">${escapeHtml(parsed.hostname)}</span>`);
  addPart('Port', parsed.port ? `<span style="color:#ffb432;">${escapeHtml(parsed.port)}</span>` : '\u2014');

  if (parsed.auth) {
    addPart('Username', escapeHtml(parsed.auth.username));
    if (parsed.auth.password) {
      addPart('Password', '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022');
    }
  }

  addPart('Path', `<code>${escapeHtml(parsed.path)}</code>`);

  if (parsed.pathSegments.length > 0) {
    addPart('Path segments', parsed.pathSegments
      .map((seg) => `<span class="tag">${escapeHtml(seg)}</span>`)
      .join(' '));
  }

  if (parsed.query) {
    addPart('Query string', `<code>${escapeHtml(parsed.query)}</code>`);
  }

  if (parsed.fragment) {
    addPart('Fragment', `<span style="color:#ffb432;">#${escapeHtml(parsed.fragment)}</span>`);
  }

  showResult($('#t8-result'), {
    label: 'URL structure',
    value: `<span style="color:#b366ff;">${escapeHtml(parsed.protocol)}</span>://` +
      (parsed.auth ? `${escapeHtml(parsed.auth.username)}:****@` : '') +
      `<span style="color:#50ff96;">${escapeHtml(parsed.hostname)}</span>` +
      (parsed.port ? `:<span style="color:#ffb432;">${escapeHtml(parsed.port)}</span>` : '') +
      `<code>${escapeHtml(parsed.path)}</code>` +
      (parsed.query ? `<span style="color:#7a6a9a;">?${escapeHtml(parsed.query)}</span>` : '') +
      (parsed.fragment ? `<span style="color:#ffb432;">#${escapeHtml(parsed.fragment)}</span>` : ''),
  });

  let detailsHtml = '<div class="url-part-grid">' + parts.join('') + '</div>';

  if (parsed.queryParams.length > 0) {
    detailsHtml += '<div style="margin-top:16px;font-size:12px;color:#7a6a9a;text-transform:uppercase;letter-spacing:0.5px;">Query Parameters</div>';
    detailsHtml += '<table style="margin-top:4px;"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>';
    for (const param of parsed.queryParams) {
      detailsHtml += `<tr><td><code>${escapeHtml(param.key)}</code></td><td><code style="color:#50ff96;">${escapeHtml(param.value)}</code></td></tr>`;
    }
    detailsHtml += '</tbody></table>';
  }

  $('#t8-details').html(detailsHtml);
}

function loadExample() {
  const index = Math.floor(Math.random() * T8_EXAMPLES.length);
  $('#t8-input').val(T8_EXAMPLES[index]);
  parseAndDisplay();
}

$(() => {
  const $input = $('#t8-input');

  $('#t8-parse').on('click', parseAndDisplay);
  $('#t8-examples').on('click', loadExample);

  $input.on('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      parseAndDisplay();
    }
  });
});
