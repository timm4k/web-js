"use strict";

let shoppingList = [];
let currentSort = { field: null, asc: true };
let nextShoppingId = 100;

function initShoppingList() {
    const saved = loadFromStorage(STORAGE_KEYS.shopping, null);
    shoppingList = saved ? saved : [];
    const maxId = shoppingList.reduce(function (max, item) { return item.id > max ? item.id : max; }, 0);
    nextShoppingId = maxId + 1;
    populateCategoryFilter();
    renderShoppingList();
}

function populateCategoryFilter() {
    const categories = shoppingList
        .map(function (item) { return item.category; })
        .filter(function (cat, index, self) { return self.indexOf(cat) === index; })
        .sort();

    const $select = $('#filter-category');
    const currentVal = $select.val();
    $select.find('option:not(:first)').remove();

    categories.forEach(function (cat) {
        $select.append('<option value="' + escapeHtml(cat) + '">' + escapeHtml(cat) + '</option>');
    });

    if (currentVal && categories.indexOf(currentVal) !== -1) {
        $select.val(currentVal);
    }
}

function getFilteredShoppingList() {
    const category = $('#filter-category').val();
    const status = $('#filter-status').val();
    const query = $('#search-item').val().toLowerCase().trim();

    let result = shoppingList.slice();

    if (category !== 'all') {
        result = result.filter(function (item) { return item.category === category; });
    }

    if (status === 'unpurchased') {
        result = result.filter(function (item) { return !item.purchased; });
    } else if (status === 'purchased') {
        result = result.filter(function (item) { return item.purchased; });
    }

    if (query) {
        result = result.filter(function (item) { return item.name.toLowerCase().indexOf(query) !== -1; });
    }

    return result;
}

function sortShoppingListField(items, field, asc) {
    return items.slice().sort(function (a, b) {
        let valA, valB;

        if (field === 'name' || field === 'category') {
            valA = a[field].toLowerCase();
            valB = b[field].toLowerCase();
            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
        }

        if (field === 'priority') {
            const order = { high: 3, normal: 2, low: 1 };
            valA = order[a.priority] || 0;
            valB = order[b.priority] || 0;
            return asc ? valA - valB : valB - valA;
        }

        valA = Number(a[field]);
        valB = Number(b[field]);
        return asc ? valA - valB : valB - valA;
    });
}

function renderShoppingList() {
    let items = getFilteredShoppingList();
    const sortField = currentSort.field;
    const sortAsc = currentSort.asc;

    if (sortField) {
        items = sortShoppingListField(items, sortField, sortAsc);
    } else {
        const unpurchased = items.filter(function (item) { return !item.purchased; });
        const purchased = items.filter(function (item) { return item.purchased; });
        items = unpurchased.concat(purchased);
    }

    let html = '<table><thead><tr>' +
        '<th>Product</th>' +
        '<th>Category</th>' +
        '<th>Qty</th>' +
        '<th>Price</th>' +
        '<th>Total</th>' +
        '<th>Priority</th>' +
        '<th>Status</th>' +
        '<th>Actions</th>' +
        '</tr></thead><tbody>';

    if (items.length === 0) {
        html += '<tr><td colspan="8"><div class="empty-state">Shopping list is empty</div></td></tr>';
    } else {
        items.forEach(function (item) {
            const purchasedClass = item.purchased ? 'purchased' : '';
            const statusHtml = item.purchased
                ? '<span class="status-badge done">Purchased</span>'
                : '<span class="status-badge pending">Pending</span>';

            const priorityClass = PRIORITY_CLASSES[item.priority] || 'priority-normal';
            const priorityLabel = PRIORITY_LABELS[item.priority] || 'Normal';
            const totalPrice = item.quantity * item.price;

            html += '<tr class="' + purchasedClass + '">' +
                '<td class="name"><span>' + escapeHtml(item.name) + '</span></td>' +
                '<td>' + escapeHtml(item.category) + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '<td>' + formatCurrency(item.price) + '</td>' +
                '<td>' + formatCurrency(totalPrice) + '</td>' +
                '<td class="' + priorityClass + '">' + priorityLabel + '</td>' +
                '<td>' + statusHtml + '</td>' +
                '<td class="flex-row" style="gap:4px;flex-wrap:nowrap;">';

            if (!item.purchased) {
                html += '<button class="btn small success btn-purchase" data-id="' + item.id + '">Buy</button>';
            }

            html += '<button class="btn small danger btn-remove-item" data-id="' + item.id + '">✕</button>' +
                '</td></tr>';
        });
    }

    html += '</tbody></table>';
    $('#shopping-table-container').html(html);
    updateShoppingSortButtons();
    renderShoppingStats();
    saveToStorage(STORAGE_KEYS.shopping, shoppingList);
}

function renderShoppingStats() {
    const total = shoppingList.length;
    const purchased = shoppingList.filter(function (item) { return item.purchased; }).length;
    const unpurchased = total - purchased;
    const totalCost = shoppingList.reduce(function (sum, item) { return sum + item.quantity * item.price; }, 0);
    const purchasedCost = shoppingList
        .filter(function (item) { return item.purchased; })
        .reduce(function (sum, item) { return sum + item.quantity * item.price; }, 0);
    const completionPercent = total > 0 ? Math.round(purchased / total * 100) : 0;

    const html = '' +
        '<div class="stat-item"><div class="stat-value">' + total + '</div><div class="stat-label">Total items</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + unpurchased + '</div><div class="stat-label">Pending</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + purchased + '</div><div class="stat-label">Purchased</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + completionPercent + '%</div><div class="stat-label">Completed</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + formatCurrency(totalCost) + '</div><div class="stat-label">Total cost</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + formatCurrency(purchasedCost) + '</div><div class="stat-label">Spent</div></div>';

    $('#shopping-stats').html(html);
}

function addToShoppingList(name, quantity, category, price, priority) {
    const raw = name.trim();
    if (!raw) return;

    const normalized = capitalizeName(raw);
    const catNormalized = capitalizeName(category.trim() || 'Other');

    const existing = shoppingList.find(function (item) {
        return item.name.toLowerCase() === normalized.toLowerCase() && !item.purchased;
    });

    if (existing) {
        existing.quantity += quantity;
    } else {
        shoppingList.push({
            id: nextShoppingId++,
            name: normalized,
            quantity: quantity,
            purchased: false,
            category: catNormalized,
            price: price,
            priority: priority,
        });
    }

    populateCategoryFilter();
    renderShoppingList();
}

function purchaseShoppingItem(id) {
    const item = shoppingList.find(function (item) { return item.id === id; });
    if (item) {
        item.purchased = true;
        renderShoppingList();
    }
}

function removeShoppingItem(id) {
    shoppingList = shoppingList.filter(function (item) { return item.id !== id; });
    populateCategoryFilter();
    renderShoppingList();
}

function updateShoppingSortButtons() {
    $('[data-sort]').each(function () {
        const field = $(this).data('sort');
        const labels = {
            name: 'Name',
            quantity: 'Qty',
            price: 'Price',
            priority: 'Priority',
            category: 'Category',
        };
        let label = labels[field] || field;
        if (currentSort.field === field) {
            label += currentSort.asc ? ' \u2191' : ' \u2193';
        } else {
            label += ' \u2195';
        }
        $(this).text(label);
    });
}

$(document).ready(function () {
    initShoppingList();

    $('#btn-add-item').on('click', function () {
        const name = $('#item-name').val();
        const quantity = parseInt($('#item-quantity').val(), 10) || 1;
        const category = $('#item-category').val() || 'Other';
        const price = parseFloat($('#item-price').val()) || 0;
        const priority = $('#item-priority').val();

        addToShoppingList(name, quantity, category, price, priority);
        $('#item-name').val('').focus();
        $('#item-quantity').val(1);
        $('#item-category').val('');
        $('#item-price').val(0);
    });

    $('#item-name').on('keypress', function (e) {
        if (e.which === 13) $('#btn-add-item').trigger('click');
    });

    $('[data-sort]').on('click', function () {
        const field = $(this).data('sort');
        if (currentSort.field === field) {
            currentSort.asc = !currentSort.asc;
        } else {
            currentSort.field = field;
            currentSort.asc = true;
        }
        renderShoppingList();
    });

    $('#filter-category, #filter-status').on('change', function () {
        renderShoppingList();
    });

    $('#search-item').on('input', function () {
        renderShoppingList();
    });

    $('#shopping-table-container').on('click', '.btn-purchase', function () {
        const id = parseInt($(this).data('id'), 10);
        purchaseShoppingItem(id);
    });

    $('#shopping-table-container').on('click', '.btn-remove-item', function () {
        const id = parseInt($(this).data('id'), 10);
        removeShoppingItem(id);
    });
});
