"use strict";

window.AnimationConstants = {
    TRANSITION: {
        FAST: "150ms ease",
        BASE: "250ms ease",
        SLOW: "400ms ease",
        SPRING: "500ms cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    PARTICLE: { LIFETIME: 1500, MAX_DELAY: 500 },
    THROTTLE: { POINTER_MOVE: 50 },
    TIMERS: {
        TOAST_REMOVE: 300,
        HIGHLIGHT_RESET: 500,
        RELIC_FEEDBACK: 200,
        INPUT_INVALID: 1000,
        SEQUENCE_RESET: 2000,
        TEMPORAL_GLOW: 300,
        SUCCESS_RESET: 700,
        INFINITE_COOLDOWN: 600
    }
};