"use strict";

function CssClass(className) {
    this.className = className;
    this.styles = [];
}

CssClass.prototype.setStyle = function (property, value) {
    for (var i = 0; i < this.styles.length; i++) {
        if (this.styles[i].property === property) {
            this.styles[i].value = value;
            return;
        }
    }
    this.styles.push({ property: property, value: value });
};

CssClass.prototype.removeStyle = function (property) {
    var updated = [];

    for (var i = 0; i < this.styles.length; i++) {
        if (this.styles[i].property !== property) {
            updated.push(this.styles[i]);
        }
    }

    this.styles = updated;
};

CssClass.prototype.getCss = function () {
    if (this.styles.length === 0) {
        return '';
    }

    var rules = [];

    for (var i = 0; i < this.styles.length; i++) {
        rules.push('    ' + this.styles[i].property + ': ' + this.styles[i].value + ';');
    }

    return '.' + this.className + ' {\n' + rules.join('\n') + '\n}';
};
