"use strict";

window.AppConstants = {
    TOTAL_MISSIONS: 18,
    CUSTOM_EVENTS: { MISSION_COMPLETE: "mission:complete", ARTIFACT_CLAIMED: "artifact-claimed" },
    RUNES: ["ᚠ", "ᚢ", "ᚦ", "ᚱ", "ᚷ", "ᛁ", "ᛇ", "ᛒ", "ᛚ", "ᛞ", "ᛟ", "ᚹ"],
    RUNE_AURAS: [
        { name: "Emerald Magic", color: "#009B77" },
        { name: "Ancient Bronze", color: "#8C7853" },
        { name: "Rune Glow", color: "#B7FF5A" },
        { name: "Golden Fate", color: "#D4AF37" },
        { name: "Shadow", color: "#36454F" },
        { name: "Illusion", color: "#50C878" },
        { name: "Copper Flame", color: "#B87333" },
        { name: "Forest", color: "#0B3D0B" }
    ],
    RUNE_COUNT: 50,
    COUNCIL_MEMBERS: [
        { name: "Thor", title: "God of Thunder" },
        { name: "Odin", title: "All-Father" },
        { name: "Frigga", title: "Queen of Asgard" },
        { name: "Heimdall", title: "Guardian of the Bifrost" },
        { name: "Sylvie", title: "Variant of Loki" },
        { name: "Mobius", title: "Agent of the TVA" },
        { name: "Ancient Scribe", title: "Keeper of Records" }
    ],
    PORTAL: { DESTINATION: "https://www.marvel.com", CONFIRMATION: "Cross the Bifrost and leave the Archive?" },
    SACRED_RELIC: { name: "Loki's Scepter Shard", rarity: "Mythic", magicPower: 99 },
    SEQUENCE: { TARGET: "LOKI" },
    TEMPORAL: { ECHO_THRESHOLD_MS: 500 },
    POINTER: { COMPLETION_MOVES: 12 },
    KEYBOARD: {
        ALLOWED_CONTROL_KEYS: ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End", "Tab"],
        ARROW_KEYS: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
        WALK_STEP: 20,
        RUN_MULTIPLIER: 2,
        HERO_COMPLETION_MOVES: 6
    },
    SCROLL: {
        TOP_BUTTON_VIEWPORTS: 1,
        BOTTOM_OFFSET: 100,
        INITIAL_RECORDS: 10,
        RECORD_BATCH: 5,
        MAX_RECORDS: 40,
        SPY_VIEWPORT_RATIO: 0.45
    },
    FATE_BOARD: {
        COLUMNS: ["Foretold", "In Motion", "Fulfilled"],
        CARDS: ["Restore the Bifrost", "Seal the Variant", "Guard the Timeline"]
    },
    DESKTOP_ICONS: [
        { left: 28, top: 30 }, { left: 150, top: 44 }, { left: 270, top: 28 },
        { left: 88, top: 132 }, { left: 225, top: 128 }
    ],
    TIMELINE_SECTIONS: ["Emerald Past", "Fractured Present", "Hidden Future"]
};