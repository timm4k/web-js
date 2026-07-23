'use strict';

const STATUS_CONFIG = Object.freeze({
    Offline: { icon: '🔴', text: 'Communication Offline', cssClass: 'status-offline' },
    Preparing: { icon: '🟡', text: 'Preparing Launch', cssClass: 'status-preparing' },
    Active: { icon: '🟢', text: 'Mission Active', cssClass: 'status-active' }
});

const STATUS_CYCLE = ['Offline', 'Preparing', 'Active'];
