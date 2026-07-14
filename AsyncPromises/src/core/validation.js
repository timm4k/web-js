"use strict";

function isEmptyInput(value) {
    return value.trim() === "";
}

function hasOnlyNumbers(array) {
    return !array.some(function (item) {
        return isNaN(Number(item));
    });
}

function parseNumber(value) {
    value = value.trim();

    if (value === "") {
        return null;
    }

    var number = Number(value);

    if (isNaN(number)) {
        return false;
    }

    return number;
}
