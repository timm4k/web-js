"use strict";

const App = {};

App.run = function () {
    App.renderProcessArray(document.getElementById('process-array'));
    App.renderFilterArray(document.getElementById('filter-array'));
    App.renderPromiseChain(document.getElementById('promise-chain'));
    App.renderSortArray(document.getElementById('sort-array'));
    App.renderMultiplyAsync(document.getElementById('multiply-async'));
    App.renderAsyncSort(document.getElementById('async-sort'));
};