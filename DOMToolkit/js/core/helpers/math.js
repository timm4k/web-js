'use strict';

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBonusLevel(value, max) {
    const ratio = value / max;
    if (ratio >= 0.7) { return 'high'; }
    if (ratio >= 0.4) { return 'medium'; }
    return 'low';
}

function getHealthLevel(health) {
    const levels = Object.values(SYSTEM_HEALTH_LEVELS);
    for (const level of levels) {
        if (health >= level.min) { return level; }
    }
    return levels[levels.length - 1];
}

function getChargeLevel(charge) {
    if (charge === 0) { return CHARGE_LEVELS.emergency; }
    if (charge < 30) { return CHARGE_LEVELS.critical; }
    if (charge < 70) { return CHARGE_LEVELS.warning; }
    return CHARGE_LEVELS.normal;
}

function getChannelType(url) {
    return CHANNEL_TYPES[url.split(':')[0]] || CHANNEL_TYPES.https;
}

function getTagIcon(tagName) {
    return TAG_ICONS[tagName] || '🏷️';
}
