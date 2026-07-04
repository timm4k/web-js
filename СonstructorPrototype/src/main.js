"use strict";

function switchTab(tabId) {
    const buttons = document.querySelectorAll('.tab-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.querySelector('.tab-btn[data-tab="' + tabId + '"]').classList.add('active');

    const contents = document.querySelectorAll('.tab-content');
    for (let j = 0; j < contents.length; j++) {
        contents[j].classList.remove('active');
    }
    document.getElementById(tabId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.tab-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            switchTab(this.getAttribute('data-tab'));
        });
    }

    App.run();
});
