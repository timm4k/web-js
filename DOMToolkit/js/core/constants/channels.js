'use strict';

const CHANNEL_TYPES = Object.freeze({
    https: { icon: '🔒', label: 'Secure', cssClass: 'secure' },
    mailto: { icon: '✉️', label: 'Mail Channel', cssClass: 'mail' },
    ftp: { icon: '📁', label: 'File Transfer', cssClass: 'file' },
    http: { icon: '🌐', label: 'Web Channel', cssClass: 'web' }
});
