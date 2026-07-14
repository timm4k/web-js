"use strict";

function washDishes() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve("Dishes washed");
        }, 2000);
    });
}

function cleanRoom() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve("Room cleaned");
        }, 4000);
    });
}

function makeDinner() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve("Dinner prepared");
        }, 7000);
    });
}
