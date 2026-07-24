window.RuneModernizer = (function () {
    'use strict';

    const MODULE_ID = 'rune-modernizer';

    function init() {
        const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
        if (!card) return;
        const visual = DOMHelper.query('.card__visual', card);
        const btn = DOMHelper.query('.btn', card);
        if (!visual || !btn) return;

        const info = DOMHelper.create('p', {
            textContent: 'An ancient rune pulses with forgotten power. Modernize it to unlock its true potential',
            style: { fontSize: '13px', color: '#8b7aa8', marginBottom: '10px' },
        });
        visual.appendChild(info);

        const wrapper = DOMHelper.create('div', {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px' },
        });

        const rune = DOMHelper.create('div', {
            className: 'rune rune--old',
            style: {
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '120px', height: '60px', background: '#2d1b00',
                border: '2px solid #8B4513', borderRadius: '8px', color: '#d4a030',
                fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold',
                letterSpacing: '2px', textShadow: '0 0 6px rgba(212,160,48,0.6)',
                transition: 'opacity 0.3s',
            },
        }, ['OLD_RUNE']);
        wrapper.appendChild(rune);
        visual.appendChild(wrapper);

        btn.addEventListener('click', function () {
            btn.disabled = true;
            run(wrapper, rune, visual, btn);
        });
    }

    async function run(wrapper, oldRune, visual, btn) {
        await AnimationHelper.waitFor(500);

        const outerHTML = oldRune.outerHTML;
        const tagName = oldRune.tagName;

        await AnimationHelper.waitFor(400);
        oldRune.style.opacity = '0';
        await AnimationHelper.waitFor(400);

        const newRune = DOMHelper.create('div', {
            className: 'rune rune--new',
            style: {
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '120px', height: '60px',
                background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
                border: '2px solid #7b2ff7', borderRadius: '8px', color: '#00e5ff',
                fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold',
                letterSpacing: '2px', textShadow: '0 0 8px rgba(0,229,255,0.7)',
                boxShadow: '0 0 12px rgba(123,47,247,0.4)',
                transition: 'opacity 0.3s', opacity: '0',
            },
        }, ['NEW_RUNE']);

        wrapper.replaceChild(newRune, oldRune);
        await AnimationHelper.waitFor(50);
        newRune.style.opacity = '1';
        await AnimationHelper.waitFor(400);

        const newOuterHTML = newRune.outerHTML;

        const html =
            '<strong>Rune Modernization Complete</strong><br>' +
            'Tag name: <code>' + tagName + '</code><br><br>' +
            '<strong>Before (outerHTML):</strong><br>' +
            '<pre style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px;font-size:11px;color:#d4a030;white-space:pre-wrap;word-wrap:break-word;line-height:1.6;max-height:140px;overflow-y:auto;border:1px solid rgba(180,130,255,0.1);">' + outerHTML.replace(/</g, '&lt;') + '</pre><br>' +
            '<strong>After (outerHTML):</strong><br>' +
            '<pre style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px;font-size:11px;color:#00e5ff;white-space:pre-wrap;word-wrap:break-word;line-height:1.6;max-height:140px;overflow-y:auto;border:1px solid rgba(180,130,255,0.1);">' + newOuterHTML.replace(/</g, '&lt;') + '</pre>';

        const panel = UIHelper.renderResultPanel('Rune Analysis ✨', html);
        visual.appendChild(panel);

        ProgressTracker.completeModule(MODULE_ID);
        UIHelper.markModuleComplete(MODULE_ID);
        btn.textContent = 'Complete!';
    }

    return { init: init };
})();
