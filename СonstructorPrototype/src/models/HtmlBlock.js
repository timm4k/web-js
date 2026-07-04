"use strict";

function HtmlBlock() {
    this.cssClasses = [];
    this.rootElement = null;
}

HtmlBlock.prototype.addCssClass = function (cssClass) {
    for (var i = 0; i < this.cssClasses.length; i++) {
        if (this.cssClasses[i].className === cssClass.className) {
            return;
        }
    }
    this.cssClasses.push(cssClass);
};

HtmlBlock.prototype.getCode = function () {
    var cssParts = [];

    for (var i = 0; i < this.cssClasses.length; i++) {
        var css = this.cssClasses[i].getCss();
        if (css.length > 0) {
            cssParts.push(css);
        }
    }

    var cssBlock = '';
    if (cssParts.length > 0) {
        cssBlock = '<style>\n' + cssParts.join('\n\n') + '\n</style>';
    }

    var htmlBlock = '';
    if (this.rootElement !== null) {
        htmlBlock = this.rootElement.getHtml();
    }

    if (cssBlock.length > 0 && htmlBlock.length > 0) {
        return cssBlock + '\n\n' + htmlBlock;
    }

    return cssBlock + htmlBlock;
};
