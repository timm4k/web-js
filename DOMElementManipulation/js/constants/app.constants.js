"use strict";

window.AppConstants = {
  MODULES: [
    {
      id: "overflow-detector",
      title: "Ancient scroll overflow detector",
      description:
        "Detect text overflow in ancient scroll containers using DOM measurement APIs ☆",
      icon: "📜",
      level: 1,
      apiDescription: "clientWidth, scrollWidth, title, styles",
    },
    {
      id: "rune-modernizer",
      title: "Ancient rune modernizer",
      description:
        "Replace outdated runes with modern equivalents using DOM replacement techniques ★",
      icon: "🔮",
      level: 1,
      apiDescription: "outerHTML, tagName, DOM replacement",
    },
    {
      id: "link-generator",
      title: "Magical tome link generator",
      description:
        "Generate dynamic hyperlinks to forbidden tomes using innerHTML manipulation ✿",
      icon: "📖",
      level: 1,
      apiDescription: "innerHTML, dynamic hyperlinks",
    },
    {
      id: "auto-scroll",
      title: "Potion log auto scroll",
      description:
        "Automatically scroll through endless potion logs using scroll positioning APIs ✧",
      icon: "🧪",
      level: 2,
      apiDescription: "scrollTop, scrollHeight",
    },
    {
      id: "recipe-replicator",
      title: "Potion recipe replicator",
      description:
        "Duplicate and modify potion recipes using cloneNode and template rendering ❁",
      icon: "⚗️",
      level: 2,
      apiDescription: "cloneNode(), template rendering",
    },
    {
      id: "ingredient-registry",
      title: "Alchemy ingredient registry",
      description:
        "Register and manage alchemical ingredients using dataset and classList APIs ✪",
      icon: "🌿",
      level: 2,
      apiDescription: "dataset, classList, textContent",
    },
    {
      id: "summoning-circle",
      title: "Summoning circle positioning",
      description:
        "Position summoning circles precisely using offset measurement API ᕤ",
      icon: "⭐",
      level: 3,
      apiDescription:
        "offsetWidth, offsetHeight, window.innerWidth, window.innerHeight",
    },
    {
      id: "ritual-progress",
      title: "Ritual completion indicator",
      description:
        "Track ritual progress with a dynamic progress bar using scroll measurement APIs ♡",
      icon: "🔥",
      level: 3,
      apiDescription:
        "scrollHeight, scrollTop, clientHeight, dynamic progress bar",
    },
    {
      id: "adaptive-layout",
      title: "Adaptive alchemy chamber",
      description:
        "Build an adaptive chamber layout that responds to viewport changes using offset APIs (^._.^)ﾉ",
      icon: "🏰",
      level: 3,
      apiDescription: "offsetHeight, dynamic layout",
    },
  ],

  LEVELS: [
    {
      id: 1,
      name: "Apprentice alchemist ☆",
      badgeClassSuffix: "apprentice",
      moduleIds: ["overflow-detector", "rune-modernizer", "link-generator"],
    },
    {
      id: 2,
      name: "Journeyman alchemist ★",
      badgeClassSuffix: "journeyman",
      moduleIds: ["auto-scroll", "recipe-replicator", "ingredient-registry"],
    },
    {
      id: 3,
      name: "Master alchemist ☆",
      badgeClassSuffix: "master",
      moduleIds: ["summoning-circle", "ritual-progress", "adaptive-layout"],
    },
  ],

  STATUS: {
    PENDING: "pending",
    ACTIVE: "active",
    COMPLETED: "completed",
  },

  MISSION: {
    title: "Alchemy laboratory",
    description:
      "Welcome, apprentice. Within this ancient laboratory lie nine forbidden arts of DOM manipulation. " +
      "Master each ritual to unlock the secrets of element sorcery and ascend through the ranks of the Alchemy Order (づ￣ 3￣)づ",
  },
};
