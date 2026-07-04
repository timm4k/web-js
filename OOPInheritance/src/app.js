"use strict";

const App = {};

App.run = function () {
    App.renderMarker(document.getElementById('marker'));
    App.renderExtendedDate(document.getElementById('extendeddate'));
    App.renderEmpTable(document.getElementById('emptable'));
    App.renderStyledTable(document.getElementById('styled'));
};
