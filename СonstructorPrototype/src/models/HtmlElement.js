"use strict";

function HtmlElement(tagName, isSelfClosing) {
    this.tagName = tagName;
    this.isSelfClosing = isSelfClosing === true;
    this.textContent = '';
    this.attributes = [];
    this.styles = [];
    this.children = [];
}

HtmlElement.prototype.setAttribute = function (name, value) {
    for (var i = 0; i < this.attributes.length; i++) {
        if (this.attributes[i].name === name) {
            this.attributes[i].value = value;
            return;
        }
    }
    this.attributes.push({ name: name, value: value });
};

HtmlElement.prototype.setStyle = function (property, value) {
    for (var i = 0; i < this.styles.length; i++) {
        if (this.styles[i].property === property) {
            this.styles[i].value = value;
            return;
        }
    }
    this.styles.push({ property: property, value: value });
};

HtmlElement.prototype.appendChild = function (element) {
    this.children.push(element);
};

HtmlElement.prototype.prependChild = function (element) {
    this.children.unshift(element);
};

HtmlElement.prototype.buildAttributeString = function () {
    var result = '';

    for (var i = 0; i < this.attributes.length; i++) {
        result += ' ' + this.attributes[i].name + '="' + this.attributes[i].value + '"';
    }

    if (this.styles.length > 0) {
        var styleParts = [];
        for (var j = 0; j < this.styles.length; j++) {
            styleParts.push(this.styles[j].property + ': ' + this.styles[j].value + ';');
        }
        result += ' style="' + styleParts.join('') + '"';
    }

    return result;
};

HtmlElement.prototype.getHtml = function (indent) {
    if (indent === undefined) {
        indent = 0;
    }

    var indentStr = '    '.repeat(indent);

    if (this.isSelfClosing) {
        var selfHtml = indentStr + '<' + this.tagName;

        for (var sa = 0; sa < this.attributes.length; sa++) {
            selfHtml += '\n' + indentStr + '    ' + this.attributes[sa].name + '="' + this.attributes[sa].value + '"';
        }

        if (this.styles.length > 0) {
            var selfStyleParts = [];
            for (var ss = 0; ss < this.styles.length; ss++) {
                selfStyleParts.push(this.styles[ss].property + ': ' + this.styles[ss].value + ';');
            }
            selfHtml += '\n' + indentStr + '    style="' + selfStyleParts.join('') + '"';
        }

        selfHtml += '\n' + indentStr + '>';
        return selfHtml;
    }

    var attrStr = this.buildAttributeString();
    var html = indentStr + '<' + this.tagName + attrStr + '>';

    var hasChildren = this.children.length > 0;

    if (hasChildren) {
        html += '\n';
    }

    if (this.textContent.length > 0) {
        html += this.textContent;
    }

    for (var ci = 0; ci < this.children.length; ci++) {
        if (ci > 0) {
            html += '\n';
        }
        html += '\n' + this.children[ci].getHtml(indent + 1);
    }

    if (hasChildren) {
        html += '\n\n' + indentStr;
    }

    html += '</' + this.tagName + '>';

    return html;
};
