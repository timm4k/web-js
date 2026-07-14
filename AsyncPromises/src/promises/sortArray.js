"use strict";

function sortArray(array) {
    return new Promise(function (resolve, reject) {
        if (!Array.isArray(array) || array.length === 0) {
            reject(new Error(MSG.EMPTY_ARRAY));
            return;
        }
        setTimeout(function () {
            var sorted = array.slice().sort(function (a, b) {
                return a - b;
            });
            resolve(sorted);
        }, 2000);
    });
}
