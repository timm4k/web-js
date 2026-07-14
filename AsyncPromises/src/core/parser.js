"use strict";

function parseArrayInput(value) {
    return value
        .split(/[,\s;]+/)
        .map(function (item) {
            return item.trim();
        })
        .filter(function (item) {
            return item !== "";
        });
}

function parseNumberArray(value) {
    var parts = parseArrayInput(value);

    if (parts.length === 0) {
        return null;
    }

    if (parts.some(function (item) {
        return isNaN(Number(item));
    })) {
        return false;
    }

    return parts.map(Number);
}
