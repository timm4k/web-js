"use strict";

window.DOMHelper = (function () {

    var _cache = {};

    return {

        query: function (selector, parent) {
            parent = parent || document;
            return parent.querySelector(selector);
        },

        queryAll: function (selector, parent) {
            parent = parent || document;
            return Array.prototype.slice.call(parent.querySelectorAll(selector));
        },

        create: function (tag, attrs, children) {
            attrs = attrs || {};
            children = children || [];

            var element = document.createElement(tag);

            if (attrs.className) element.className = attrs.className;
            if (attrs.id) element.id = attrs.id;
            if (attrs.textContent) element.textContent = attrs.textContent;
            if (attrs.innerHTML) element.innerHTML = attrs.innerHTML;
            if (attrs.type) element.type = attrs.type;
            if (attrs.disabled) element.disabled = true;
            if (attrs.placeholder) element.placeholder = attrs.placeholder;

            if (attrs.dataset) {
                var dsKeys = Object.keys(attrs.dataset);
                for (var i = 0; i < dsKeys.length; i++) {
                    element.dataset[dsKeys[i]] = attrs.dataset[dsKeys[i]];
                }
            }

            if (attrs.style) {
                var stKeys = Object.keys(attrs.style);
                for (var j = 0; j < stKeys.length; j++) {
                    element.style[stKeys[j]] = attrs.style[stKeys[j]];
                }
            }

            for (var k = 0; k < children.length; k++) {
                var child = children[k];
                if (typeof child === "string") {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            }

            return element;
        },

        createFragment: function () {
            return document.createDocumentFragment();
        },

        removeChildren: function (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        },

        insertBefore: function (newEl, referenceEl) {
            if (referenceEl && referenceEl.parentNode) {
                referenceEl.parentNode.insertBefore(newEl, referenceEl);
            }
        },

        insertAfter: function (newEl, referenceEl) {
            if (referenceEl && referenceEl.parentNode) {
                referenceEl.parentNode.insertBefore(newEl, referenceEl.nextSibling);
            }
        },

        cache: function (selector, parent) {
            parent = parent || document;
            var key = selector + (parent === document ? "" : parent.tagName);
            if (!_cache[key]) {
                _cache[key] = this.query(selector, parent);
            }
            return _cache[key];
        },

        on: function (element, event, handler, options) {
            element.addEventListener(event, handler, options);
        },

        off: function (element, event, handler, options) {
            element.removeEventListener(event, handler, options);
        },

        clearCache: function () {
            var keys = Object.keys(_cache);
            for (var i = 0; i < keys.length; i++) {
                delete _cache[keys[i]];
            }
        }

    };

})();
