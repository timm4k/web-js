"use strict";

window.MathHelper = {

    clamp: function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    lerp: function (start, end, t) {
        return start + (end - start) * t;
    },

    percentage: function (value, total) {
        if (total === 0) return 0;
        return (value / total) * 100;
    },

    randomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    isOverflowing: function (element) {
        return {
            horizontal: element.scrollWidth > element.clientWidth,
            vertical: element.scrollHeight > element.clientHeight
        };
    },

    getScrollPercent: function (element) {
        var scrollTop = element.scrollTop || document.documentElement.scrollTop;
        var scrollHeight = element.scrollHeight - element.clientHeight;
        if (scrollHeight === 0) return 0;
        return (scrollTop / scrollHeight) * 100;
    }

};
