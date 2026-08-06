"use strict";

window.DOMHelper = (function () {
    var cacheStore = {};

    function query(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    function queryAll(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function create(tag, attrs, children) {
        attrs = attrs || {};
        children = children || [];
        var element = document.createElement(tag);
        ["id", "className", "textContent", "type", "placeholder", "autocomplete", "href", "src", "alt", "title", "value", "role", "tabIndex", "draggable"].forEach(function (property) {
            if (attrs[property] !== undefined) element[property] = attrs[property];
        });
        if (attrs.disabled) element.disabled = true;
        if (attrs.hidden) element.hidden = true;
        if (attrs.innerHTML) element.innerHTML = attrs.innerHTML;
        Object.keys(attrs.dataset || {}).forEach(function (key) {
            element.dataset[key] = attrs.dataset[key];
        });
        Object.keys(attrs.style || {}).forEach(function (key) {
            element.style[key] = attrs.style[key];
        });
        Object.keys(attrs.attributes || {}).forEach(function (key) {
            element.setAttribute(key, attrs.attributes[key]);
        });
        children.forEach(function (child) {
            element.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
        });
        return element;
    }

    function removeChildren(element) {
        if (!element) return;
        while (element.firstChild) element.removeChild(element.firstChild);
    }

    function getTaskView(taskId) {
        var card = query('[data-mission-id="' + taskId + '"]');
        return {
            card: card,
            visual: query("#" + taskId + "-visual"),
            result: query("#" + taskId + "-result"),
            log: query("#" + taskId + "-log"),
            activateButton: card ? query('[data-action="activate"]', card) : null,
            resetButton: card ? query('[data-action="reset"]', card) : null
        };
    }

    function bindTask(taskId, activateHandler, resetHandler) {
        var view = getTaskView(taskId);
        if (!view.card) return null;
        if (view.activateButton) view.activateButton.addEventListener("click", activateHandler);
        if (view.resetButton) view.resetButton.addEventListener("click", resetHandler);
        return view;
    }

    function closestWithin(target, selector, container) {
        var match = target.closest(selector);
        return match && container.contains(match) ? match : null;
    }

    function isTaskVisible(taskId) {
        var view = getTaskView(taskId);
        var panel = view.card && view.card.closest(".tab-panel");
        return !!panel && panel.classList.contains("active");
    }

    return {
        query: query,
        queryAll: queryAll,
        create: create,
        createFragment: function () {
            return document.createDocumentFragment();
        },
        removeChildren: removeChildren,
        getTaskView: getTaskView,
        bindTask: bindTask,
        closestWithin: closestWithin,
        isTaskVisible: isTaskVisible,
        clamp: function (value, minimum, maximum) {
            return Math.max(minimum, Math.min(maximum, value));
        },
        insertBefore: function (newElement, referenceElement) {
            if (referenceElement && referenceElement.parentNode) referenceElement.parentNode.insertBefore(newElement, referenceElement);
        },
        insertAfter: function (newElement, referenceElement) {
            if (referenceElement && referenceElement.parentNode) referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
        },
        cache: function (selector, parent) {
            var key = selector + ((parent || document) === document ? "" : parent.tagName);
            if (!cacheStore[key]) cacheStore[key] = query(selector, parent);
            return cacheStore[key];
        },
        on: function (element, eventName, handler, options) {
            element.addEventListener(eventName, handler, options);
        },
        off: function (element, eventName, handler, options) {
            element.removeEventListener(eventName, handler, options);
        },
        clearCache: function () {
            cacheStore = {};
        }
    };
})();
