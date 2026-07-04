"use strict";

function Circle(radius) {
    if (radius < 0) {
        throw new Error('Radius cannot be negative');
    }

    var _radius = radius;

    Object.defineProperty(this, 'radius', {
        get: function () {
            return _radius;
        },
        set: function (value) {
            if (value < 0) {
                throw new Error('Radius cannot be negative');
            }
            _radius = value;
        },
        enumerable: true,
        configurable: true,
    });
}

Object.defineProperty(Circle.prototype, 'diameter', {
    get: function () {
        return this.radius * 2;
    },
    enumerable: true,
    configurable: true,
});

Circle.prototype.calculateArea = function () {
    return Math.PI * this.radius * this.radius;
};

Circle.prototype.calculateCircumference = function () {
    return 2 * Math.PI * this.radius;
};
