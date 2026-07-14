"use strict";

function filterArray(array, callback) {
    return array.filter(function (item) {
        return callback(item);
    });
}

function isEven(number) {
    return number % 2 === 0;
}

function isShortWord(word) {
    return word.length <= 4;
}
