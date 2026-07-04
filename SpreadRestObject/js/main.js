"use strict";

function switchTab(tabId) {
    $(".tab-btn").removeClass("active");
    $(".tab-btn[data-tab=\"" + tabId + "\"]").addClass("active");
    $(".tab-content").removeClass("active");
    $("#" + tabId).addClass("active");
}

$(document).ready(function () {
    $(".tab-btn").on("click", function () {
        switchTab($(this).data("tab"));
    });
});
