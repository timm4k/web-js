"use strict";

window.WebTasks.push(
  (() => {
    const ID = "jquery-ajax-search";
    const state = {
      query: "",
      type: "track",
      page: 1,
      totalPages: 1,
      requestPath: "",
    };
    let searchRequest = null;
    let detailsRequest = null;
    const form = () => DOMHelper.query("#jquery-ajax-search-form");
    const results = () => DOMHelper.query("#music-results");
    const pagination = () => DOMHelper.query("#music-pagination");
    const details = () => DOMHelper.query("#music-details");
    const normalizeArtistKey = (value) =>
      value
        .toLowerCase()
        .replaceAll(String.fromCharCode(8217), "")
        .replaceAll(String.fromCharCode(39), "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    const featuredArtistForQuery = () =>
      AppConstants.FEATURED_ARTISTS[normalizeArtistKey(state.query)] || null;

    const ajax = (path, data = {}) => {
      if (!window.jQuery)
        return Promise.reject(new Error("jQuery is unavailable"));
      return window.jQuery.ajax({
        url: `${AppConstants.DEEZER_API}${path}`,
        method: "GET",
        data: { ...data, output: "jsonp" },
        dataType: "jsonp",
        timeout: 12000,
      });
    };
    const imageFor = (item) =>
      item.album?.cover_medium ||
      item.cover_medium ||
      item.picture_medium ||
      "";
    const titleFor = (item) => item.title || item.name || "Untitled record";
    const artistFor = (item) =>
      item.artist?.name ||
      (state.type === "artist" ? "Artist profile" : "Unknown artist");
    const metaFor = (item) => {
      if (state.type === "track") return item.album?.title || "Track";
      if (state.type === "album") return item.record_type || "Album";
      return `${Number(item.nb_album || 0).toLocaleString()} albums`;
    };
    const makeImage = (source, alt) => {
      const image = DOMHelper.element("img", {
        attributes: { alt, loading: "lazy" },
      });
      if (source) image.src = source;
      return image;
    };
    const createCatalogueCard = (item) => {
      const card = DOMHelper.element("article", {
        className: "catalogue-card",
      });
      const body = DOMHelper.element("div", {
        className: "catalogue-card__body",
      });
      const title = DOMHelper.element("h4", { text: titleFor(item) });
      const artist = DOMHelper.element("p", { text: artistFor(item) });
      const meta = DOMHelper.element("p", { text: metaFor(item) });
      const button = DOMHelper.element("button", {
        className: "btn btn--ghost",
        text: "Details",
        attributes: {
          type: "button",
          "data-details-id": String(item.id),
          "data-details-type": state.type,
        },
      });
      body.append(title, artist, meta, button);
      card.append(makeImage(imageFor(item), `${titleFor(item)} artwork`), body);
      return card;
    };
    const pageNumbers = () => {
      const total = state.totalPages;
      const visible = AppConstants.MAX_PAGE_BUTTONS;
      if (total <= visible)
        return Array.from({ length: total }, (_, index) => index + 1);
      const pages = new Set([1, total, state.page]);
      for (let distance = 1; pages.size < visible; distance += 1) {
        if (state.page - distance > 1) pages.add(state.page - distance);
        if (pages.size < visible && state.page + distance < total)
          pages.add(state.page + distance);
        if (distance > total) break;
      }
      return [...pages].sort((first, second) => first - second);
    };
    const renderPagination = () => {
      DOMHelper.clear(pagination());
      if (state.totalPages <= 1) return;
      let previousPage = 0;
      pageNumbers().forEach((page) => {
        if (previousPage && page - previousPage > 1)
          pagination().append(DOMHelper.element("span", { text: "…" }));
        const button = DOMHelper.element("button", {
          className: `page-button${page === state.page ? " active" : ""}`,
          text: String(page),
          attributes: {
            type: "button",
            "data-page": String(page),
            "aria-label": `Open result page ${page}`,
          },
        });
        if (page === state.page) button.setAttribute("aria-current", "page");
        pagination().append(button);
        previousPage = page;
      });
    };
    const renderResults = (data) => {
      DOMHelper.clear(results());
      details().hidden = true;
      DOMHelper.clear(details());
      if (!Array.isArray(data.data) || data.data.length === 0) {
        DOMHelper.clear(pagination());
        UI.showError(ID, "Record not found!");
        return;
      }
      data.data.forEach((item) => results().append(createCatalogueCard(item)));
      state.totalPages = Math.max(
        1,
        Math.ceil(
          Number(data.total || data.data.length) / AppConstants.PAGE_SIZE,
        ),
      );
      renderPagination();
      UI.completeTask(
        ID,
        `${data.data.length} records loaded · page ${state.page} of ${state.totalPages}`,
      );
    };
    const loadPage = (page) => {
      if (!window.jQuery) {
        UI.showError(
          ID,
          "jQuery is unavailable. Check the network and reload the archive",
        );
        return;
      }
      state.page = page;
      const featuredArtist = featuredArtistForQuery();
      UI.setResult(
        ID,
        featuredArtist
          ? `Loading official ${featuredArtist.name} ${state.type} records`
          : `Loading ${state.type} records for “${state.query}”`,
      );
      if (searchRequest?.abort) searchRequest.abort();
      let requestData = {};
      let handleData = renderResults;
      if (featuredArtist && state.type === "artist") {
        state.requestPath = `/artist/${featuredArtist.id}`;
        handleData = (record) => renderResults({ data: [record], total: 1 });
      } else if (featuredArtist) {
        const collection = state.type === "track" ? "top" : "albums";
        state.requestPath = `/artist/${featuredArtist.id}/${collection}`;
        requestData = {
          limit: AppConstants.PAGE_SIZE,
          index: (state.page - 1) * AppConstants.PAGE_SIZE,
        };
        handleData = (response) => {
          if (state.type === "album") {
            response.data = response.data.map((album) => ({
              ...album,
              artist: { id: featuredArtist.id, name: featuredArtist.name },
            }));
          }
          renderResults(response);
        };
      } else {
        state.requestPath = `/search/${state.type}`;
        requestData = {
          q: state.query,
          limit: AppConstants.PAGE_SIZE,
          index: (state.page - 1) * AppConstants.PAGE_SIZE,
        };
      }
      searchRequest = ajax(state.requestPath, requestData);
      searchRequest.done(handleData).fail((request, status) => {
        if (status === "abort") return;
        UI.showError(
          ID,
          "The music catalogue is unavailable. Check the network and try again",
        );
      });
    };
    const handleSubmit = () => {
      const data = new FormData(form());
      state.query = String(data.get("query") || "").trim();
      state.type = String(data.get("type") || "track");
      if (!state.query) {
        UI.showError(ID, "Choose a featured band before searching");
        DOMHelper.query("#music-query").focus();
        return;
      }
      loadPage(1);
    };
    const handlePageClick = (event) => {
      const button = event.target.closest("[data-page]");
      if (!button) return;
      const page = Number(button.dataset.page);
      if (page !== state.page) loadPage(page);
    };
    const detailRows = (record, type) => {
      if (type === "track")
        return [
          ["Artist", record.artist?.name],
          ["Album", record.album?.title],
          [
            "Duration",
            `${Math.floor((record.duration || 0) / 60)}:${String((record.duration || 0) % 60).padStart(2, "0")}`,
          ],
          ["Release", record.release_date],
          ["BPM", record.bpm > 0 ? record.bpm : "Unknown"],
          ["Rank", record.rank?.toLocaleString()],
          ["ISRC", record.isrc],
          ["Explicit", record.explicit_lyrics ? "Yes" : "No"],
        ];
      if (type === "album")
        return [
          ["Artist", record.artist?.name],
          ["Release", record.release_date],
          ["Tracks", record.nb_tracks],
          ["Genre", record.genres?.data?.map((genre) => genre.name).join(", ")],
          ["Fans", record.fans?.toLocaleString()],
          ["Label", record.label],
          ["UPC", record.upc],
        ];
      return [
        ["Artist", record.name],
        ["Albums", record.nb_album],
        ["Fans", record.nb_fan?.toLocaleString()],
        ["Radio", record.radio ? "Available" : "Unavailable"],
      ];
    };
    const streamingLinks = (record) => {
      const links = DOMHelper.element("div", { className: "streaming-links" });
      if (record.link) {
        links.append(
          DOMHelper.element("a", {
            className: "btn btn--primary",
            text: "Listen on Deezer",
            attributes: {
              href: record.link,
              target: "_blank",
              rel: "noopener noreferrer",
            },
          }),
        );
      }
      const searchTitle =
        `${record.artist?.name || ""} ${titleFor(record)}`.trim();
      links.append(
        DOMHelper.element("a", {
          className: "btn btn--spotify",
          text: "Find on Spotify",
          attributes: {
            href: `https://open.spotify.com/search/${encodeURIComponent(searchTitle)}`,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
      );
      return links;
    };
    const renderDetails = (record, type) => {
      DOMHelper.clear(details());
      const modalCard = DOMHelper.element("article", {
        className: "details-card",
      });
      const closeButton = DOMHelper.element("button", {
        className: "details-close",
        text: "×",
        attributes: {
          type: "button",
          "data-close-details": "",
          "aria-label": "Close catalogue details",
        },
      });
      const content = DOMHelper.element("div");
      const heading = DOMHelper.element("h4", {
        text: titleFor(record),
        attributes: { id: "music-details-title" },
      });
      const list = DOMHelper.element("dl");
      detailRows(record, type).forEach(([label, value]) => {
        if (value === undefined || value === null || value === "") return;
        list.append(
          DOMHelper.element("dt", { text: String(label) }),
          DOMHelper.element("dd", { text: String(value) }),
        );
      });
      content.append(heading, list, streamingLinks(record));
      modalCard.append(
        closeButton,
        makeImage(
          imageFor(record) || record.picture_xl || record.cover_xl,
          `${titleFor(record)} artwork`,
        ),
        content,
      );
      details().append(modalCard);
      details().setAttribute("aria-labelledby", "music-details-title");
      details().hidden = false;
      document.body.classList.add("modal-open");
      closeButton.focus();
      UI.setResult(ID, `Detailed ${type} record loaded`, UIConstants.SUCCESS);
    };
    const closeDetails = () => {
      details().hidden = true;
      document.body.classList.remove("modal-open");
    };
    const handleDetailsOverlayClick = (event) => {
      if (
        event.target === details() ||
        event.target.closest("[data-close-details]")
      )
        closeDetails();
    };
    const handleEscape = (event) => {
      if (event.key === "Escape" && !details().hidden) closeDetails();
    };
    const handleDetailsClick = (event) => {
      const button = event.target.closest("[data-details-id]");
      if (!button) return;
      const type = button.dataset.detailsType;
      const id = button.dataset.detailsId;
      UI.setResult(ID, "Loading detailed catalogue record");
      if (detailsRequest?.abort) detailsRequest.abort();
      detailsRequest = ajax(`/${type}/${id}`);
      detailsRequest
        .done((record) => {
          if (record.error) {
            UI.showError(ID, "Detailed record was not found");
            return;
          }
          renderDetails(record, type);
        })
        .fail((request, status) => {
          if (status !== "abort")
            UI.showError(ID, "Detailed record could not be loaded");
        });
    };
    const init = () => {
      form().addEventListener("submit", handleSubmit);
      pagination().addEventListener("click", handlePageClick);
      results().addEventListener("click", handleDetailsClick);
      details().addEventListener("click", handleDetailsOverlayClick);
      document.addEventListener("keydown", handleEscape);
      if (!window.jQuery)
        UI.showError(
          ID,
          "jQuery failed to load. Check the network before using AJAX search",
        );
    };
    return Object.freeze({ init });
  })(),
);
