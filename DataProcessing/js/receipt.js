"use strict";

let receiptItems = [];
let receiptSort = { field: null, asc: true };
let nextReceiptId = 100;
let receiptSaves = [];
let nextSaveId = 1;

function initReceipt() {
    receiptSaves = loadFromStorage(STORAGE_KEYS.receiptSaves, []);
    const maxSaveId = receiptSaves.reduce(function (max, s) { return s.id > max ? s.id : max; }, 0);
    nextSaveId = maxSaveId + 1;

    const saved = loadFromStorage(STORAGE_KEYS.receipt, null);
    receiptItems = saved || [];
    const maxId = receiptItems.reduce(function (max, item) { return item.id > max ? item.id : max; }, 0);
    nextReceiptId = maxId + 1;

    renderReceipt();
}

function getReceiptItemsWithTotals() {
    return receiptItems.map(function (item) {
        const discountedPrice = calculateDiscountPrice(item.price, item.discount);
        const lineTotal = discountedPrice * item.quantity;
        const discountPercent = item.discount > 0 && item.price > 0
            ? Math.round(item.discount / item.price * 100)
            : 0;
        return {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
            discount: item.discount,
            discountPercent: discountPercent,
            discountedPrice: discountedPrice,
            lineTotal: lineTotal,
        };
    });
}

function sortReceiptItems(items, field, asc) {
    return items.slice().sort(function (a, b) {
        if (field === 'name') {
            const valA = a.name.toLowerCase();
            const valB = b.name.toLowerCase();
            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
        }
        if (field === 'total') {
            return asc ? a.lineTotal - b.lineTotal : b.lineTotal - a.lineTotal;
        }
        const valA = Number(a[field]);
        const valB = Number(b[field]);
        return asc ? valA - valB : valB - valA;
    });
}

function renderReceipt() {
    let items = getReceiptItemsWithTotals();
    const sortField = receiptSort.field;
    const sortAsc = receiptSort.asc;

    if (sortField) {
        items = sortReceiptItems(items, sortField, sortAsc);
    }

    let html = '<table><thead><tr>' +
        '<th>Product</th>' +
        '<th>Category</th>' +
        '<th>Qty</th>' +
        '<th>Price</th>' +
        '<th>Discount</th>' +
        '<th>Total</th>' +
        '<th></th>' +
        '</tr></thead><tbody>';

    if (items.length === 0) {
        html += '<tr><td colspan="7"><div class="empty-state">Receipt is empty</div></td></tr>';
    } else {
        items.forEach(function (item) {
            html += '<tr>' +
                '<td>' + escapeHtml(item.name) + '</td>' +
                '<td>' + escapeHtml(item.category) + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '<td>' + formatCurrency(item.discountedPrice) +
                (item.discount > 0 ? ' <span style="color:#ff6060;font-size:11px;">(-' + item.discountPercent + '%)</span>' : '') +
                '</td>' +
                '<td>' + (item.discountPercent > 0 ? '-' + item.discountPercent + '%' : '—') + '</td>' +
                '<td>' + formatCurrency(item.lineTotal) + '</td>' +
                '<td><button class="btn small danger" data-receipt-remove="' + item.id + '">✕</button></td>' +
                '</tr>';
        });
    }

    html += '</tbody></table>';
    $('#receipt-table-container').html(html);

    $('[data-receipt-remove]').on('click', function () {
        const id = parseInt($(this).data('receipt-remove'), 10);
        removeReceiptItem(id);
    });

    updateReceiptSortButtons();
    renderReceiptTotals(items);
    renderReceiptSavesDropdown();
}

function renderReceiptTotals(items) {
    const total = items.reduce(function (sum, item) { return sum + item.lineTotal; }, 0);
    const itemCount = items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    const avgPrice = itemCount > 0 ? total / itemCount : 0;

    const mostExpensive = items.reduce(function (max, item) {
        return item.lineTotal > max.lineTotal ? item : max;
    }, items[0] || { name: '—', lineTotal: 0 });

    const statsHtml = '' +
        '<div class="stat-item"><div class="stat-value">' + itemCount + '</div><div class="stat-label">Total units</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + formatCurrency(total) + '</div><div class="stat-label">Total sum</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + formatCurrency(mostExpensive.lineTotal) + '</div><div class="stat-label">Most expensive (' + escapeHtml(mostExpensive.name) + ')</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + formatCurrency(avgPrice) + '</div><div class="stat-label">Avg price per unit (total / units)</div></div>';

    $('#receipt-stats').html(statsHtml);

    let totalHtml = '<div class="receipt-total">';

    const categories = items.reduce(function (acc, item) {
        if (!acc[item.category]) acc[item.category] = 0;
        acc[item.category] += item.lineTotal;
        return acc;
    }, {});

    Object.keys(categories).sort().forEach(function (cat) {
        totalHtml += '<div class="line"><span>' + escapeHtml(cat) + '</span><span>' + formatCurrency(categories[cat]) + '</span></div>';
    });

    totalHtml += '<div class="line grand"><span>Total</span><span>' + formatCurrency(total) + '</span></div>';
    totalHtml += '</div>';

    $('#receipt-total-container').html(totalHtml);
}

function addReceiptItem(name, quantity, price, category, discount) {
    const raw = name.trim();
    if (!raw) return;

    const normalized = capitalizeName(raw);
    const cat = category.trim() || 'Other';
    const catNormalized = capitalizeName(cat);

    const existing = receiptItems.find(function (item) {
        return item.name.toLowerCase() === normalized.toLowerCase() && item.category.toLowerCase() === catNormalized.toLowerCase();
    });

    if (existing) {
        existing.quantity += quantity;
        if (existing.price !== price) {
            existing.price = (existing.price + price) / 2;
        }
        existing.discount = (existing.discount + discount) / 2;
    } else {
        receiptItems.push({
            id: nextReceiptId++,
            name: normalized,
            quantity: quantity,
            price: price,
            category: catNormalized,
            discount: discount,
        });
    }

    saveToStorage(STORAGE_KEYS.receipt, receiptItems);
    renderReceipt();
}

function removeReceiptItem(id) {
    receiptItems = receiptItems.filter(function (item) { return item.id !== id; });
    saveToStorage(STORAGE_KEYS.receipt, receiptItems);
    renderReceipt();
}

function saveCurrentReceipt() {
    const name = $('#receipt-save-name').val().trim();
    if (!name) {
        alert('Enter a name for this receipt.');
        return;
    }

    const existing = receiptSaves.find(function (s) { return s.name.toLowerCase() === name.toLowerCase(); });
    if (existing) {
        existing.items = JSON.parse(JSON.stringify(receiptItems));
        existing.date = Date.now();
    } else {
        receiptSaves.push({
            id: nextSaveId++,
            name: name,
            items: JSON.parse(JSON.stringify(receiptItems)),
            date: Date.now(),
        });
    }

    $('#receipt-save-name').val('');
    saveToStorage(STORAGE_KEYS.receiptSaves, receiptSaves);
    renderReceipt();
}

function newReceipt() {
    if (receiptItems.length > 0 && !confirm('Clear current receipt and start a new one?')) {
        return;
    }
    receiptItems = [];
    nextReceiptId = 100;
    saveToStorage(STORAGE_KEYS.receipt, receiptItems);
    renderReceipt();
}

function loadSavedReceipt(id) {
    const saved = receiptSaves.find(function (s) { return s.id === id; });
    if (!saved) return;
    receiptItems = JSON.parse(JSON.stringify(saved.items));
    const maxId = receiptItems.reduce(function (max, item) { return item.id > max ? item.id : max; }, 0);
    nextReceiptId = maxId + 1;
    saveToStorage(STORAGE_KEYS.receipt, receiptItems);
    renderReceipt();
}

function deleteSavedReceipt(id) {
    if (!confirm('Delete this saved receipt?')) return;
    receiptSaves = receiptSaves.filter(function (s) { return s.id !== id; });
    saveToStorage(STORAGE_KEYS.receiptSaves, receiptSaves);
    renderReceipt();
}

function renderReceiptSavesDropdown() {
    const $select = $('#receipt-saves-select');
    const currentVal = $select.val();
    $select.find('option:not(:first)').remove();

    receiptSaves.forEach(function (s) {
        $select.append('<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>');
    });

    if (currentVal && receiptSaves.some(function (s) { return String(s.id) === currentVal; })) {
        $select.val(currentVal);
    } else {
        $select.val('');
    }
}

function updateReceiptSortButtons() {
    $('[data-receipt-sort]').each(function () {
        const field = $(this).data('receipt-sort');
        const labels = {
            name: 'Name',
            quantity: 'Qty',
            price: 'Price',
            total: 'Total',
        };
        let label = labels[field] || field;
        if (receiptSort.field === field) {
            label += receiptSort.asc ? ' \u2191' : ' \u2193';
        } else {
            label += ' \u2195';
        }
        $(this).text(label);
    });
}

$(document).ready(function () {
    initReceipt();

    $('#btn-add-receipt').on('click', function () {
        const name = $('#receipt-name').val();
        const quantity = parseInt($('#receipt-quantity').val(), 10) || 1;
        const price = parseFloat($('#receipt-price').val()) || 0;
        const category = $('#receipt-category').val() || 'Other';
        const discount = parseFloat($('#receipt-discount').val()) || 0;

        addReceiptItem(name, quantity, price, category, discount);
        $('#receipt-name').val('').focus();
        $('#receipt-quantity').val(1);
        $('#receipt-price').val(0);
        $('#receipt-category').val('');
        $('#receipt-discount').val(0);
    });

    $('#receipt-name').on('keypress', function (e) {
        if (e.which === 13) $('#btn-add-receipt').trigger('click');
    });

    $('[data-receipt-sort]').on('click', function () {
        const field = $(this).data('receipt-sort');
        if (receiptSort.field === field) {
            receiptSort.asc = !receiptSort.asc;
        } else {
            receiptSort.field = field;
            receiptSort.asc = true;
        }
        renderReceipt();
    });

    $('#btn-receipt-save').on('click', saveCurrentReceipt);

    $('#btn-receipt-new').on('click', newReceipt);

    $('#btn-receipt-load').on('click', function () {
        const id = parseInt($('#receipt-saves-select').val(), 10);
        if (!id) return;
        loadSavedReceipt(id);
    });

    $('#btn-receipt-delete-save').on('click', function () {
        const id = parseInt($('#receipt-saves-select').val(), 10);
        if (!id) return;
        deleteSavedReceipt(id);
    });
});
