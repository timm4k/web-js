"use strict";

window.WebTasks = [];
window.AppConstants = Object.freeze({
  TOTAL_TASKS: 10,
  EVENT_TASK_COMPLETE: "web-data-task:complete",
  STORAGE_BAND: "midnight-archive:band-name",
  STORAGE_RATES: "midnight-archive:currency-rates",
  CACHE_TTL: 60 * 60 * 1000,
  COOKIE_NAME: "accepted",
  COOKIE_MAX_AGE: 3600,
  PAGE_SIZE: 10,
  MAX_PAGE_BUTTONS: 7,
  DEEZER_API: "https://api.deezer.com",
  FEATURED_ARTISTS: Object.freeze({
    cinderella: Object.freeze({ id: 8397, name: "Cinderella" }),
    "guns n roses": Object.freeze({ id: 663, name: "Guns N' Roses" }),
    metallica: Object.freeze({ id: 119, name: "Metallica" }),
    "quiet riot": Object.freeze({ id: 5732, name: "Quiet Riot" }),
    "bon jovi": Object.freeze({ id: 637, name: "Bon Jovi" }),
    "def leppard": Object.freeze({ id: 2557, name: "Def Leppard" }),
    ratt: Object.freeze({ id: 7738, name: "Ratt" }),
    winger: Object.freeze({ id: 3427, name: "Winger" }),
    "ac/dc": Object.freeze({ id: 115, name: "AC/DC" }),
  }),
  CAT_FACT_API: "https://catfact.ninja/fact",
  GITHUB_API: "https://api.github.com/users/",
  NBU_API: "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json",
  CURRENCY_CODES: Object.freeze(["USD", "EUR", "GBP", "PLN"]),
  CURRENCY_NAMES: Object.freeze({
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "Pound Sterling",
    PLN: "Polish Zloty",
  }),
  SPA_PAGES: Object.freeze({
    home: Object.freeze({
      title: "Tour Home",
      text: "Tonight’s headliner enters beneath red and lavender stage lights as the world tour begins",
    }),
    about: Object.freeze({
      title: "Band Biography",
      text: "The archive follows the band from its first rehearsal room to sold-out arenas",
    }),
    contacts: Object.freeze({
      title: "Booking Office",
      text: "Promoters can prepare venue dates, production requirements and backstage contacts",
    }),
  }),
});
