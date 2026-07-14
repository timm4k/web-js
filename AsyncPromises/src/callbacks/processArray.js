"use strict";

function processArray(array, callback) {
    return array.map(function (item) {
        return callback(item);
    });
}

function doubleElement(element) {
    return element * 2;
}

function reverseElement(element) {
    return String(element).split('').reverse().join('');
}
