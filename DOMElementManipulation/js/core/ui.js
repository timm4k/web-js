const UI = {
    renderCard(moduleData, status = 'pending') {
        const C = window.UIConstants.CARDS;
        const card = window.DOMHelper.create('div');
        card.className = `${C.BASE}${status === 'completed' ? ' ' + C.COMPLETED : ''}`;
        card.dataset.moduleId = moduleData.id;

        const header = window.DOMHelper.create('div');
        header.className = C.HEADER;

        const icon = window.DOMHelper.create('span');
        icon.className = C.ICON;
        icon.textContent = moduleData.icon;

        const statusEl = window.DOMHelper.create('span');
        statusEl.className = C.STATUS + ' ' + C.STATUS + '--' + status;
        statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);

        header.appendChild(icon);
        header.appendChild(statusEl);

        const title = window.DOMHelper.create('h3');
        title.className = C.TITLE;
        title.textContent = moduleData.title;

        const description = window.DOMHelper.create('p');
        description.className = C.DESCRIPTION;
        description.textContent = moduleData.description;

        const apiBadge = window.DOMHelper.create('span');
        apiBadge.className = C.API_BADGE;
        apiBadge.textContent = `API: ${moduleData.apiDescription}`;

        const visual = window.DOMHelper.create('div');
        visual.className = C.VISUAL;
        visual.dataset.moduleId = moduleData.id;

        const actions = window.DOMHelper.create('div');
        actions.className = C.ACTIONS;

        const btnText = status === 'completed' ? 'Review (」○」)' : 'Start Experiment';
        const btn = this.createButton(btnText, moduleData.id);
        actions.appendChild(btn);

        card.appendChild(header);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(apiBadge);
        card.appendChild(visual);
        card.appendChild(actions);

        return card;
    },

    renderLevelSection(levelData, statusLabel = '') {
        const LS = window.UIConstants.LEVEL_SECTION;

        const section = window.DOMHelper.create('div');
        section.className = LS.BASE;
        section.dataset.levelId = levelData.id;

        const header = window.DOMHelper.create('div');
        header.className = `${LS.BASE}__header`;

        const badge = window.DOMHelper.create('span');
        badge.className = LS.BADGE;
        badge.textContent = `Level ${levelData.id}`;

        const heading = window.DOMHelper.create('h2');
        heading.textContent = levelData.name;

        header.appendChild(badge);
        header.appendChild(heading);

        if (statusLabel) {
            const label = window.DOMHelper.create('span');
            label.className = `${LS.BASE}__status`;
            label.textContent = statusLabel;
            header.appendChild(label);
        }

        const modules = window.DOMHelper.create('div');
        modules.className = LS.MODULES;

        section.appendChild(header);
        section.appendChild(modules);

        return section;
    },

    renderResultPanel(title, htmlContent) {
        const RP = window.UIConstants.RESULT_PANEL;

        const panel = window.DOMHelper.create('div');
        panel.className = RP.BASE;

        const titleEl = window.DOMHelper.create('h4');
        titleEl.className = RP.TITLE;
        titleEl.textContent = title;

        const content = window.DOMHelper.create('div');
        content.className = `${RP.BASE}__content`;

        if (typeof htmlContent === 'string') {
            content.innerHTML = htmlContent;
        } else {
            content.appendChild(htmlContent);
        }

        panel.appendChild(titleEl);
        panel.appendChild(content);

        return panel;
    },

    renderToast(message, type = 'success') {
        const T = window.UIConstants.TOAST;
        let container = document.querySelector(`.${T.CONTAINER}`);

        if (!container) {
            container = window.DOMHelper.create('div');
            container.className = T.CONTAINER;
            document.body.appendChild(container);
        }

        const toast = window.DOMHelper.create('div');
        toast.className = `${T.BASE} ${T.BASE}--${type}`;

        const text = window.DOMHelper.create('span');
        text.className = T.TEXT;
        text.textContent = message;

        toast.appendChild(text);
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add(`${T.BASE}--removing`);
                setTimeout(() => toast.remove(), 250);
            }
        }, 3000);

        return toast;
    },

    updateCardStatus(cardEl, status) {
        const C = window.UIConstants.CARDS;

        const statusEl = cardEl.querySelector(`.${C.STATUS}`);
        if (statusEl) {
            statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusEl.className = C.STATUS + ' ' + C.STATUS + '--' + status;
        }

        if (status === 'completed') {
            cardEl.classList.add(C.COMPLETED);
        } else {
            cardEl.classList.remove(C.COMPLETED);
        }
    },

    markModuleComplete(moduleId) {
        const card = document.querySelector(`[data-module-id="${moduleId}"]`);
        if (card) {
            this.updateCardStatus(card, 'completed');
        }
        this.unlockNewlyAvailableModules();
        this.renderToast('Module completed! ✨☆');
    },

    unlockNewlyAvailableModules() {
        const lockedCards = document.querySelectorAll('.card--locked');
        lockedCards.forEach(card => {
            const mid = card.dataset.moduleId;
            if (mid && window.ProgressTracker.isModuleUnlocked(mid)) {
                card.classList.remove('card--locked');
                this.updateCardStatus(card, 'pending');
            }
        });

        document.querySelectorAll('.level-section').forEach(section => {
            const levelId = parseInt(section.dataset.levelId, 10);
            if (!levelId) return;
            const status = window.ProgressTracker.getLevelStatus(levelId);
            const badge = section.querySelector('.level-section__badge');
            if (badge) {
                badge.classList.remove('level-section__badge--level1', 'level-section__badge--level2', 'level-section__badge--level3');
                const suffixes = { 1: 'level1', 2: 'level2', 3: 'level3' };
                badge.classList.add('level-section__badge--' + (suffixes[levelId] || 'level1'));
            }
        });
    },

    createButton(text, moduleId, variant = 'primary') {
        const B = window.UIConstants.BUTTONS;

        const btn = window.DOMHelper.create('button');
        btn.className = `${B.BASE} ${B.BASE}--${variant}`;
        btn.dataset.moduleId = moduleId;
        btn.textContent = text;

        return btn;
    }
};

window.UI = UI;
window.UIHelper = UI;
