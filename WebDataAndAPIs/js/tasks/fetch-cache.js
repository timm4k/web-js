"use strict";

window.WebTasks.push(
  (() => {
    const ID = "fetch-cache";
    let loading = false;
    const list = () => DOMHelper.query("#currency-list");
    const source = () => DOMHelper.query("#currency-source");
    const button = () => DOMHelper.query("#currency-load");
    const readCache = () => {
      try {
        const raw = localStorage.getItem(AppConstants.STORAGE_RATES);
        if (!raw) return null;
        const cached = JSON.parse(raw);
        if (!Array.isArray(cached.rates) || !Number.isFinite(cached.timestamp))
          return null;
        return Date.now() - cached.timestamp < AppConstants.CACHE_TTL
          ? cached
          : null;
      } catch {
        return null;
      }
    };
    const writeCache = (rates) => {
      const payload = { timestamp: Date.now(), rates };
      localStorage.setItem(AppConstants.STORAGE_RATES, JSON.stringify(payload));
      return payload;
    };
    const renderRates = (rates, origin, timestamp) => {
      DOMHelper.clear(list());
      rates.forEach((rate) => {
        const item = DOMHelper.element("li");
        item.append(
          DOMHelper.element("strong", { text: `${rate.cc}: ` }),
          document.createTextNode(
            `${Number(rate.rate).toFixed(4)} UAH · ${AppConstants.CURRENCY_NAMES[rate.cc]}`,
          ),
        );
        list().append(item);
      });
      source().textContent = `${origin} · ${new Date(timestamp).toLocaleString()}`;
    };
    const load = async () => {
      if (loading) return;
      loading = true;
      button().disabled = true;
      const cached = readCache();
      if (cached) {
        renderRates(cached.rates, "localStorage cache", cached.timestamp);
        UI.completeTask(
          ID,
          "Tour budget rates loaded from the one-hour cache without another network request",
        );
        loading = false;
        button().disabled = false;
        return;
      }
      UI.setResult(
        ID,
        "Tour rate cache missing or expired · requesting current NBU data",
      );
      try {
        const response = await fetch(AppConstants.NBU_API, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const rates = data.filter((rate) =>
          AppConstants.CURRENCY_CODES.includes(rate.cc),
        );
        if (!rates.length) throw new Error("Expected currencies missing");
        const cachedPayload = writeCache(rates);
        renderRates(rates, "NBU network response", cachedPayload.timestamp);
        UI.completeTask(
          ID,
          "Current tour rates fetched and cached for one hour",
        );
      } catch (error) {
        UI.showError(
          ID,
          "International tour rates are unavailable. Check the network and try again",
        );
      } finally {
        loading = false;
        button().disabled = false;
      }
    };
    const clearCache = () => {
      try {
        localStorage.removeItem(AppConstants.STORAGE_RATES);
      } catch {}
      DOMHelper.clear(list());
      list().append(
        DOMHelper.element("li", { text: "Tour rate cache cleared" }),
      );
      source().textContent = "No source selected";
      UI.setResult(ID, "Cached tour rates removed");
    };
    const init = () => {
      button().addEventListener("click", load);
      DOMHelper.query("#currency-clear").addEventListener("click", clearCache);
    };
    return Object.freeze({ init });
  })(),
);
