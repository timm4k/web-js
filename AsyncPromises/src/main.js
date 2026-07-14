"use strict";

function switchTab(tabId) {
    var buttons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.querySelector('.tab-btn[data-tab="' + tabId + '"]').classList.add('active');

    var contents = document.querySelectorAll('.tab-content');
    for (var j = 0; j < contents.length; j++) {
        contents[j].classList.remove('active');
    }
    document.getElementById(tabId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            switchTab(this.getAttribute('data-tab'));
        });
    }

    App.run();
});