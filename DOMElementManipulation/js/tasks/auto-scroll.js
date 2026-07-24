window.AutoScroll = (function () {
    'use strict';

    const MODULE_ID = 'auto-scroll';

    const LOG_ENTRIES = [
        'Added 3 drops of dragon\'s breath',
        'Heated solution to 340°F',
        'Stirred clockwise 7 times',
        'Crushed moonstone dust into powder',
        'Infused with phoenix feather extract',
        'Filtered through enchanted linen',
        'Added pinch of shadow root',
        'Warmed mixture at low flame',
        'Poured in essence of void crystal',
        'Shaken vigorously for 30 seconds',
        'Left to settle in moonlight',
        'Evaporated excess water at 212°F',
        'Mixed with elderberry concentrate',
        'Added stabilizing agent: ground pearl',
        'Sealed flask and agitated gently',
    ];

    const COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#e91e63'];

    function init() {
        const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
        if (!card) return;
        const visual = DOMHelper.query('.card__visual', card);
        const btn = DOMHelper.query('.btn', card);
        if (!visual || !btn) return;

        const heading = DOMHelper.create('h4', {
            textContent: 'Potion Log',
            style: { color: '#d4b8ff', marginBottom: '8px' },
        });
        visual.appendChild(heading);

        const container = DOMHelper.create('div', {
            className: 'scroll-container',
            style: { height: '150px', padding: '8px' },
        });
        visual.appendChild(container);

        const counter = DOMHelper.create('div', {
            style: { marginTop: '8px', fontSize: '12px', color: '#8b7aa8' },
        }, ['Entries: 0 | Scroll: 0 / 0']);
        visual.appendChild(counter);

        btn.addEventListener('click', function () {
            btn.disabled = true;
            run(container, counter, visual, btn);
        });
    }

    async function run(container, counter, visual, btn) {
        let count = 0;

        for (let i = 0; i < LOG_ENTRIES.length; i++) {
            const mins = String(Math.floor(i / 3)).padStart(2, '0');
            const secs = String((i * 7) % 60).padStart(2, '0');

            const entry = DOMHelper.create('div', {
                style: {
                    padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px',
                    opacity: '0', transition: 'opacity 0.3s, transform 0.3s',
                    transform: 'translateX(-10px)',
                },
            }, [
                DOMHelper.create('span', {
                    style: { width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: '0' },
                }),
                DOMHelper.create('span', {
                    textContent: '[' + mins + ':' + secs + ']',
                    style: { color: '#666', fontFamily: 'monospace', fontSize: '10px' },
                }),
                DOMHelper.create('span', { textContent: LOG_ENTRIES[i] }),
            ]);

            container.appendChild(entry);
            count++;

            await AnimationHelper.waitFor(50);
            entry.style.opacity = '1';
            entry.style.transform = 'translateX(0)';

            const maxScroll = container.scrollHeight - container.clientHeight;
            container.scrollTop = maxScroll;

            counter.textContent = 'Entries: ' + count + ' | Scroll: ' + Math.round(container.scrollTop) + ' / ' + container.scrollHeight;
            await AnimationHelper.waitFor(80);
        }

        const resultHtml =
            '<strong>Auto Scroll Complete ╯σ□╯</strong><br>' +
            'Total entries: <code>' + count + '</code><br>' +
            'Final scrollTop: <code>' + Math.round(container.scrollTop) + 'px</code><br>' +
            'Final scrollHeight: <code>' + container.scrollHeight + 'px</code><br>' +
            'Container clientHeight: <code>' + container.clientHeight + 'px</code>';

        const panel = UIHelper.renderResultPanel('Scroll Analysis', resultHtml);
        visual.appendChild(panel);

        ProgressTracker.completeModule(MODULE_ID);
        UIHelper.markModuleComplete(MODULE_ID);
        btn.textContent = 'Complete!';
    }

    return { init: init };
})();
