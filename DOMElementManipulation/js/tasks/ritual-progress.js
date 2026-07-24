window.RitualProgress = (function () {
    'use strict';

    const MODULE_ID = 'ritual-progress';

    const STEPS = [
        { title: 'preparation of the circle', text: 'Draw the sacred symbols in chalk upon the stone floor' },
        { title: 'ignition of incense', text: 'Light the dragon sage incense. Let the smoke purify the area' },
        { title: 'invocation of elements', text: 'Call upon the four elemental spirits by name' },
        { title: 'mixing the elixirs', text: 'Combine moonstone powder with phoenix ash. Stir seven times' },
        { title: 'channeling energy', text: 'Place hands upon the crystal matrix. Feel the arcane flow' },
        { title: 'binding the runes', text: 'Inscribe the binding sigils upon each component' },
        { title: 'stabilization phase', text: 'Hold the energy steady. Count to thirteen breaths' },
        { title: 'final convergence', text: 'Release all channels simultaneously' },
        { title: 'sealing the work', text: 'Draw the final ward of protection' },
        { title: 'completion', text: 'The transmutation is complete. Record the results' },
    ];

    function buildSteps(container) {
        STEPS.forEach(function (step, i) {
            container.appendChild(DOMHelper.create('div', {
                style: {
                    padding: '10px 14px', marginBottom: '6px',
                    background: 'rgba(180,130,255,0.06)', border: '1px solid rgba(180,130,255,0.12)',
                    borderRadius: '8px',
                },
            }, [
                DOMHelper.create('div', {
                    textContent: 'Stage ' + (i + 1) + ': ' + step.title,
                    style: { fontWeight: '600', fontSize: '13px', color: '#d4b8ff', marginBottom: '3px' },
                }),
                DOMHelper.create('div', {
                    textContent: step.text,
                    style: { fontSize: '12px', color: '#8b7aa8', lineHeight: '1.5' },
                }),
            ]));
        });
    }

    function updateMeasurements(display, data) {
        display.textContent = '';
        ['scrollTop: ' + data.scrollTop + 'px', 'scrollHeight: ' + data.scrollHeight + 'px', 'clientHeight: ' + data.clientHeight + 'px'].forEach(function (text) {
            display.appendChild(DOMHelper.create('span', {
                textContent: text,
                style: { background: 'rgba(0,229,255,0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0,229,255,0.15)' },
            }));
        });
    }

    function init() {
        const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
        if (!card) return;
        const visual = DOMHelper.query('.card__visual', card);
        const btn = DOMHelper.query('.btn', card);
        if (!visual || !btn) return;

        const container = DOMHelper.create('div', {
            className: 'scroll-container',
            style: { height: '160px', padding: '8px' },
        });
        buildSteps(container);
        visual.appendChild(container);

        const progressWrapper = DOMHelper.create('div', { style: { marginTop: '10px' } });
        const progressLabel = DOMHelper.create('div', {
            style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8b7aa8', marginBottom: '4px' },
        }, [
            DOMHelper.create('span', { textContent: 'Ritual Progress' }),
            DOMHelper.create('span', { className: 'ritual-pct', textContent: '0%' }),
        ]);
        const bar = DOMHelper.create('div', { className: 'progress-bar' });
        const fill = DOMHelper.create('div', { className: 'progress-bar__fill', style: { width: '0%', transition: 'width 80ms linear' } });
        bar.appendChild(fill);
        progressWrapper.appendChild(progressLabel);
        progressWrapper.appendChild(bar);
        visual.appendChild(progressWrapper);

        const measureDisplay = DOMHelper.create('div', {
            style: { display: 'flex', gap: '8px', marginTop: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#00e5ff', flexWrap: 'wrap' },
        });
        visual.appendChild(measureDisplay);
        updateMeasurements(measureDisplay, { scrollTop: 0, scrollHeight: container.scrollHeight, clientHeight: container.clientHeight });

        btn.addEventListener('click', function () {
            btn.disabled = true;
            run(container, fill, progressLabel, measureDisplay, visual, btn);
        });
    }

    async function run(container, fill, progressLabel, measureDisplay, visual, btn) {
        const pctEl = progressLabel.querySelector('.ritual-pct');
        const maxScroll = container.scrollHeight - container.clientHeight;

        if (maxScroll <= 0) return;

        const step = Math.max(1, Math.floor(maxScroll / 120));
        let current = 0;

        await new Promise(function (resolve) {
            function tick() {
                current = Math.min(current + step, maxScroll);
                container.scrollTop = current;
                const pct = Math.round((current / maxScroll) * 100);
                fill.style.width = pct + '%';
                if (pctEl) pctEl.textContent = pct + '%';
                updateMeasurements(measureDisplay, {
                    scrollTop: Math.round(container.scrollTop),
                    scrollHeight: container.scrollHeight,
                    clientHeight: container.clientHeight,
                });
                if (current >= maxScroll) {
                    fill.style.width = '100%';
                    if (pctEl) pctEl.textContent = '100%';
                    resolve();
                } else {
                    requestAnimationFrame(tick);
                }
            }
            requestAnimationFrame(tick);
        });

        await AnimationHelper.waitFor(400);

        const resultHtml =
            '<strong>Ritual Complete</strong><br>' +
            'Final scrollTop: <code>' + container.scrollTop + 'px</code><br>' +
            'scrollHeight: <code>' + container.scrollHeight + 'px</code><br>' +
            'clientHeight: <code>' + container.clientHeight + 'px</code><br>' +
            'Max scrollable: <code>' + maxScroll + 'px</code><br>' +
            'Scroll percent: <code>100%</code>';

        const panel = UIHelper.renderResultPanel('Ritual Report ❁', resultHtml);
        visual.appendChild(panel);

        ProgressTracker.completeModule(MODULE_ID);
        UIHelper.markModuleComplete(MODULE_ID);
        btn.textContent = 'Complete!';
    }

    return { init: init };
})();
