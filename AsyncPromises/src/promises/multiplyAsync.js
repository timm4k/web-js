"use strict";

function multiplyAsync(a, b) {
    return new Promise(function (resolve, reject) {
        if (typeof a !== "number" || typeof b !== "number" || isNaN(a) || isNaN(b)) {
            reject(new Error(MSG.MULTIPLY_FAILED));
            return;
        }
        setTimeout(function () {
            resolve(a * b);
        }, 2000);
    });
}
