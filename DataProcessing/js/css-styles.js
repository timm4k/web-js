"use strict";

const STYLE_PRESETS = {
    heading: [
        { name: 'color', value: '#b366ff' },
        { name: 'font-size', value: '28px' },
        { name: 'font-weight', value: 'bold' },
        { name: 'text-align', value: 'center' },
        { name: 'text-shadow', value: '0 0 15px rgba(179,102,255,0.5)' },
        { name: 'letter-spacing', value: '2px' },
        { name: 'text-transform', value: 'uppercase' },
    ],
    alert: [
        { name: 'color', value: '#ff6060' },
        { name: 'background-color', value: 'rgba(255,80,80,0.1)' },
        { name: 'border', value: '1px solid rgba(255,80,80,0.3)' },
        { name: 'padding', value: '16px 20px' },
        { name: 'font-weight', value: 'bold' },
        { name: 'border-radius', value: '4px' },
    ],
    highlight: [
        { name: 'background-color', value: 'rgba(179,102,255,0.15)' },
        { name: 'color', value: '#d0c0f0' },
        { name: 'padding', value: '4px 10px' },
        { name: 'border-radius', value: '3px' },
        { name: 'font-weight', value: '600' },
    ],
    code: [
        { name: 'font-family', value: "'Consolas', 'Courier New', monospace" },
        { name: 'background-color', value: 'rgba(10,10,30,0.8)' },
        { name: 'color', value: '#50ff96' },
        { name: 'padding', value: '12px 16px' },
        { name: 'border', value: '1px solid rgba(80,255,150,0.2)' },
        { name: 'border-radius', value: '4px' },
        { name: 'font-size', value: '14px' },
    ],
    custom: [],
};

let currentStyles = [];
let activePreset = 'heading';

function saveStylesState() {
    saveToStorage(STORAGE_KEYS.stylesPreset, activePreset);
    saveToStorage(STORAGE_KEYS.stylesCurrent, currentStyles);
}

function initTask3() {
    const savedStyles = loadFromStorage(STORAGE_KEYS.stylesCurrent, null);
    const savedPreset = loadFromStorage(STORAGE_KEYS.stylesPreset, null);

    if (savedStyles !== null) {
        currentStyles = savedStyles;
        activePreset = savedPreset || 'custom';
    } else {
        applyPreset('heading');
        return;
    }

    $('.preset-btn').removeClass('active');
    if (STYLE_PRESETS[activePreset] !== undefined) {
        $('.preset-btn[data-preset="' + activePreset + '"]').addClass('active');
    } else {
        $('.preset-btn[data-preset="custom"]').addClass('active');
    }

    renderStyleTable();
    updatePreview();
}

function applyPreset(presetName) {
    activePreset = presetName;
    const styles = STYLE_PRESETS[presetName] || [];
    currentStyles = styles.map(function (s) { return { name: s.name, value: s.value }; });

    $('.preset-btn').removeClass('active');
    $('.preset-btn[data-preset="' + presetName + '"]').addClass('active');

    saveStylesState();
    renderStyleTable();
    updatePreview();
}

function renderStyleTable() {
    if (currentStyles.length === 0) {
        $('#style-table-container').html('<div class="empty-state">No styles defined. Choose a preset or add your own.</div>');
        return;
    }

    let html = '<table><thead><tr><th>Property</th><th>Value</th><th>Actions</th></tr></thead><tbody>';
    currentStyles.forEach(function (style, index) {
        html += '<tr>' +
            '<td><code>' + escapeHtml(style.name) + '</code></td>' +
            '<td><code>' + escapeHtml(style.value) + '</code></td>' +
            '<td><button class="btn small danger btn-remove-style" data-index="' + index + '">✕</button></td>' +
            '</tr>';
    });
    html += '</tbody></table>';
    $('#style-table-container').html(html);
    updateGeneratedCode();
}

function addCustomStyle(name, value) {
    if (!name.trim() || !value.trim()) return;
    currentStyles.push({ name: name.trim(), value: value.trim() });
    activePreset = 'custom';
    $('.preset-btn').removeClass('active');
    $('.preset-btn[data-preset="custom"]').addClass('active');
    saveStylesState();
    renderStyleTable();
    updatePreview();
}

function removeStyle(index) {
    currentStyles.splice(index, 1);
    if (currentStyles.length === 0) {
        activePreset = 'custom';
        $('.preset-btn').removeClass('active');
        $('.preset-btn[data-preset="custom"]').addClass('active');
    }
    saveStylesState();
    renderStyleTable();
    updatePreview();
}

function clearStyles() {
    currentStyles = [];
    activePreset = 'custom';
    $('.preset-btn').removeClass('active');
    $('.preset-btn[data-preset="custom"]').addClass('active');
    saveStylesState();
    renderStyleTable();
    updatePreview();
}

function buildStyleString() {
    return currentStyles.map(function (s) { return s.name + ': ' + s.value + ';'; }).join(' ');
}

function updatePreview() {
    const text = $('#style-text-input').val() || 'Text for formatting';
    const styleStr = buildStyleString();

    if (styleStr) {
        $('#preview-text').attr('style', styleStr).text(text);
    } else {
        $('#preview-text').removeAttr('style').text('Click "Apply styles" to preview');
    }
}

function updateGeneratedCode() {
    const styleStr = buildStyleString();
    if (!styleStr) {
        $('#generated-html').text('{ }');
        return;
    }
    const text = $('#style-text-input').val() || 'text';
    const code = '<span style="' + escapeHtml(styleStr) + '">' + escapeHtml(text) + '</span>';
    $('#generated-html').text(code);
}

function applyStylesToPreview() {
    const text = $('#style-text-input').val() || 'Text for formatting';
    const styleStr = buildStyleString();
    $('#preview-text').attr('style', styleStr).text(text);
    updateGeneratedCode();
}

function applyStylesDocumentWrite() {
    const text = $('#style-text-input').val() || 'Text for formatting';
    const styleStr = buildStyleString();

    if (!styleStr) {
        alert('Add at least one style before using document.write()');
        return;
    }

    const win = window.open('', '_blank', 'width=600,height=400,scrollbars=yes');
    if (!win) {
        alert('Please allow popups for this site');
        return;
    }

    let content = '<!DOCTYPE html><html><head><title>CSS Styles</title></head><body>';
    content += '<span style="' + escapeHtml(styleStr) + '">' + escapeHtml(text) + '</span>';
    content += '</body></html>';

    win.document.write(content);
    win.document.close();
}

$(document).ready(function () {
    initTask3();

    $('.preset-btn').on('click', function () {
        applyPreset($(this).data('preset'));
    });

    $('#btn-add-style').on('click', function () {
        const name = $('#new-style-name').val();
        const value = $('#new-style-value').val();
        addCustomStyle(name, value);
        $('#new-style-name').val('').focus();
        $('#new-style-value').val('');
    });

    $('#new-style-value').on('keypress', function (e) {
        if (e.which === 13) $('#btn-add-style').trigger('click');
    });

    $('#style-table-container').on('click', '.btn-remove-style', function () {
        const index = parseInt($(this).data('index'), 10);
        removeStyle(index);
    });

    $('#btn-clear-styles').on('click', function () {
        clearStyles();
    });

    $('#style-text-input').on('input', function () {
        updatePreview();
        updateGeneratedCode();
    });

    $('#btn-apply-styles').on('click', function () {
        applyStylesToPreview();
    });

    $('#btn-document-write').on('click', function () {
        applyStylesDocumentWrite();
    });
});
