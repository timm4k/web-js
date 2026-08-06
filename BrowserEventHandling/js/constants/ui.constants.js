"use strict";

window.UIConstants = {
    CARDS: {
        BASE: "mission-card", COMPLETED: "mission-card completed", HEADER: "mission-card__header",
        BADGE: "mission-card__badge", NUMBER: "mission-card__number", TITLE: "mission-card__title",
        SUBTITLE: "mission-card__subtitle", BRIEFING: "mission-card__briefing",
        OBJECTIVE: "mission-card__objective", VISUAL: "mission-card__visual", ACTIONS: "mission-card__actions"
    },
    BUTTONS: { PRIMARY: "btn btn--primary", SECONDARY: "btn btn--secondary", GOLD: "btn btn--gold", DANGER: "btn btn--danger" },
    RESULT: { BASE: "result-panel", SUCCESS: "result-panel result-panel--success" },
    LOG: { BASE: "event-log", ENTRY: "event-log__entry", MAX_ENTRIES: 50 },
    TOAST: { BASE: "toast", SUCCESS: "toast toast--success", REMOVING: "toast--removing", DURATION: 3000 },
    PARTICLES: { CLASS: "magic-particle", COUNT: 6 },
    RUNE: { CELL: "rune-cell", ACTIVE: "rune-cell active", DISMISSED: "rune-cell dismissed" },
    PROPAGATION: {
        TREE: "propagation-tree", NODE: "propagation-node", HIGHLIGHTED: "propagation-node highlighted",
        LABEL: "propagation-node__label", NAME: "propagation-node__name"
    },
    ARCHIVE: { LIST: "archive-list", ITEM: "archive-item", SELECTED: "archive-item selected" },
    CANVAS: { AREA: "canvas-area" },
    INCANTATION: { INPUT: "incantation-input" },
    RELIC: {
        CONTAINER: "relic-container", ARTIFACT: "relic-artifact", ARTIFACT_ACTIVE: "relic-artifact relic-artifact--active",
        ARTIFACT_DORMANT: "relic-artifact relic-artifact--dormant", PORTAL: "relic-portal",
        PORTAL_ACTIVE: "relic-portal relic-portal--active", VAULT: "relic-vault",
        VAULT_ITEM: "relic-vault__item", VAULT_EMPTY: "relic-vault__empty"
    },
    COUNCIL: {
        TABLE: "council-table", ROW: "council-row", MEMBER: "council-member",
        NAME: "council-member__name", TITLE: "council-member__title", DISMISS: "btn btn--danger btn--sm"
    },
    TEMPORAL: { RELIC: "temporal-relic", RELIC_AWAKENED: "temporal-relic temporal-relic--awakened", GLOW: "temporal-glow" },
    SEQUENCE: {
        INPUT: "sequence-input", DISPLAY: "sequence-display", CHAR: "sequence-char",
        CHAR_ACTIVE: "sequence-char sequence-char--active", CHAR_CORRECT: "sequence-char sequence-char--correct"
    },
    FOLLOWER: { ORB: "cursor-orb" },
    VALIDATION: { INPUT: "rune-text-input", INVALID: "input-invalid" },
    ASCENT: { BUTTON: "btn btn--gold ascent-button", CHRONICLE: "scroll-chronicle" },
    HERO: { FIELD: "hero-field", SIGIL: "hero-sigil", CONTROLS: "hero-controls" },
    SLIDER: { TRACK: "resonance-track", THUMB: "resonance-thumb", DRAGGING: "dragging" },
    INFINITE: { LIST: "endless-list", RECORD: "chronicle-block" },
    BOARD: { ROOT: "fate-board", COLUMN: "fate-column", CARD: "fate-card" },
    SELECTION: {
        DESKTOP: "illusion-desktop", ICON: "archive-icon", SELECTED: "selected",
        BOX: "selection-box", COUNTER: "selection-counter"
    },
    SCROLLSPY: { MENU: "scrollspy-menu", LINK: "scrollspy-link", ACTIVE: "active", SECTION: "timeline-section" }
};