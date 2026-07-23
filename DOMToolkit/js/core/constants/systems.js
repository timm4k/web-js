'use strict';

const SYSTEM_HEALTH_LEVELS = Object.freeze({
    excellent: { min: 80, label: 'Excellent', cssClass: 'excellent' },
    stable: { min: 60, label: 'Stable', cssClass: 'stable' },
    warning: { min: 30, label: 'Warning', cssClass: 'warning' },
    critical: { min: 0, label: 'Critical', cssClass: 'critical' }
});

const CHARGE_LEVELS = Object.freeze({
    emergency: { threshold: 0, label: 'Emergency Mode', cssClass: 'emergency', icon: '🚨' },
    critical: { threshold: 30, label: 'Critical', cssClass: 'critical', icon: '⚠️' },
    warning: { threshold: 70, label: 'Warning', cssClass: 'warning', icon: '🟠' },
    normal: { threshold: 101, label: 'Operational', cssClass: 'normal', icon: '✅' }
});

const ORBITAL_MODULE_SPECIAL_MARKER = '★ Special';
const TOTAL_MODULES = 9;
