"use strict";

const STORAGE_KEYS = {
    shopping: 'dp_shopping_list',
    receipt: 'dp_receipt_items',
    receiptSaves: 'dp_receipt_saves',
    stylesPreset: 'dp_styles_preset',
    stylesCurrent: 'dp_styles_current',
    classrooms: 'dp_classrooms',
};

const CURRENCY = 'UAH';

const PRIORITY_LABELS = {
    high: 'High',
    normal: 'Normal',
    low: 'Low',
};

const PRIORITY_CLASSES = {
    high: 'priority-high',
    normal: 'priority-normal',
    low: 'priority-low',
};

function formatCurrency(value) {
    return Number(value).toFixed(2) + ' ' + CURRENCY;
}

function calculateDiscountPrice(price, discountUah) {
    return price - discountUah;
}

function calculateTax(price, rate) {
    return price * (rate / 100);
}

function loadFromStorage(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        return fallback;
    }
    return fallback;
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        return;
    }
}

function capitalizeName(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function switchTab(tabId) {
    $('.tab-btn').removeClass('active');
    $('.tab-btn[data-tab="' + tabId + '"]').addClass('active');
    $('.tab-content').removeClass('active');
    $('#' + tabId).addClass('active');
}

$(document).ready(function () {
    $('.tab-btn').on('click', function () {
        switchTab($(this).data('tab'));
    });
});
