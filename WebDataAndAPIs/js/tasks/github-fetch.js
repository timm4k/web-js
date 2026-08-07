"use strict";

window.WebTasks.push(
  (() => {
    const ID = "github-fetch";
    let loading = false;
    const form = () => DOMHelper.query("#github-fetch-form");
    const input = () => DOMHelper.query("#github-username");
    const profile = () => DOMHelper.query("#github-profile");
    const renderProfile = (user) => {
      DOMHelper.clear(profile());
      const image = DOMHelper.element("img", {
        attributes: { src: user.avatar_url, alt: `${user.login} avatar` },
      });
      const content = DOMHelper.element("div");
      const name = DOMHelper.element("strong", {
        text: user.name || user.login,
      });
      const login = DOMHelper.element("p", { text: `@${user.login}` });
      const link = DOMHelper.element("a", {
        text: "Open GitHub profile",
        attributes: {
          href: user.html_url,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      });
      content.append(name, login, link);
      profile().append(image, content);
      profile().hidden = false;
    };
    const search = async () => {
      if (loading) return;
      const username = input().value.trim();
      if (!username) {
        UI.showError(
          ID,
          "Enter a developer’s GitHub username before searching",
        );
        input().focus();
        return;
      }
      loading = true;
      DOMHelper.query('button[type="submit"]', form()).disabled = true;
      profile().hidden = true;
      UI.setResult(ID, `Searching for @${username}`);
      try {
        const response = await fetch(
          `${AppConstants.GITHUB_API}${encodeURIComponent(username)}`,
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (response.status === 404) {
          UI.showError(ID, "Tour web developer not found");
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const user = await response.json();
        renderProfile(user);
        UI.completeTask(
          ID,
          "The developer’s GitHub profile is ready for the tour crew",
        );
      } catch (error) {
        UI.showError(
          ID,
          "GitHub could not be reached. Check the network and try again",
        );
      } finally {
        loading = false;
        DOMHelper.query('button[type="submit"]', form()).disabled = false;
      }
    };
    const init = () => form().addEventListener("submit", search);
    return Object.freeze({ init });
  })(),
);
