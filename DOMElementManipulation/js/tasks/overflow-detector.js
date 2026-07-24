window.OverflowDetector = (function () {
    'use strict';

    const MODULE_ID = 'overflow-detector';

    function init() {
        const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
        if (!card) return;
        const visual = DOMHelper.query('.card__visual', card);
        const btn = DOMHelper.query('.btn', card);
        if (!visual || !btn) return;

        const info = DOMHelper.create('p', {
            textContent: 'This scroll contains ancient knowledge far too vast for its vessel. Click to measure the overflow',
            style: { fontSize: '13px', color: '#8b7aa8', marginBottom: '10px' },
        });
        visual.appendChild(info);

        const scrollContainer = DOMHelper.create('div', {
            className: 'scroll-container',
            style: { width: '200px', height: '100px', overflow: 'auto', padding: '8px', fontSize: '12px', lineHeight: '1.6', color: '#d4b8ff' },
        }, [
            DOMHelper.create('p', {
                textContent: 'As a child, Edward and his brother Alphonse tried to bring their dead mother back to life using alchemy. The attempt ended in tragedy: Alphonse lost his entire body, and Edward lost his left leg. By sacrificing his right arm, Edward managed to bind his brother\'s soul to a suit of armor. After that, he burned down their home and set out to find the Philosopher\'s Stone to restore their bodies. When Edward discovered that the Philosopher\'s Stone was created by sacrificing thousands of human lives, he refused to use it. Instead, he fought against the Homunculi, who planned to destroy their country. After many battles, Edward defeated the main enemy. In the end, he made his final sacrifice by giving up his ability to use alchemy forever in exchange for restoring his brother\'s body. After everything was over, he returned to a peaceful family life.',
            }),
        ]);
        visual.appendChild(scrollContainer);

        const statusLine = DOMHelper.create('div', {
            style: { fontSize: '12px', color: '#8b7aa8', marginTop: '8px' },
        }, ['Status: Awaiting analysis...']);
        visual.appendChild(statusLine);

        btn.addEventListener('click', function () {
            btn.disabled = true;
            run(scrollContainer, statusLine, visual, btn);
        });
    }

    async function run(el, statusLine, visual, btn) {
        statusLine.textContent = 'Status: Measuring horizontal dimensions...';
        await AnimationHelper.waitFor(400);

        const clientWidth = el.clientWidth;
        const scrollWidth = el.scrollWidth;
        const hOverflow = scrollWidth > clientWidth;

        statusLine.textContent = 'Status: Measuring vertical dimensions...';
        await AnimationHelper.waitFor(400);

        const clientHeight = el.clientHeight;
        const scrollHeight = el.scrollHeight;
        const vOverflow = scrollHeight > clientHeight;

        await AnimationHelper.waitFor(300);
        el.title = 'clientWidth: ' + clientWidth + 'px, scrollWidth: ' + scrollWidth + 'px, clientHeight: ' + clientHeight + 'px, scrollHeight: ' + scrollHeight + 'px';

        if (hOverflow || vOverflow) {
            el.style.borderColor = '#ff6b6b';
            el.style.boxShadow = '0 0 12px rgba(255,107,107,0.4)';
            statusLine.textContent = 'Status: Overflow detected! ロ（オωオ）ロ Border highlighted.';
            statusLine.style.color = '#ff6b6b';
        } else {
            el.style.borderColor = '#4ecdc4';
            statusLine.textContent = 'Status: No overflow detected. ✨';
            statusLine.style.color = '#4ecdc4';
        }

        await AnimationHelper.waitFor(300);

        const html =
            '<strong>Scroll Measurements</strong><br>' +
            'clientWidth: <code>' + clientWidth + 'px</code><br>' +
            'scrollWidth: <code>' + scrollWidth + 'px</code><br>' +
            'clientHeight: <code>' + clientHeight + 'px</code><br>' +
            'scrollHeight: <code>' + scrollHeight + 'px</code><br>' +
            'Horizontal overflow: <code>' + hOverflow + '</code><br>' +
            'Vertical overflow: <code>' + vOverflow + '</code><br>' +
            'title attribute: <code>"' + el.title + '"</code>';

        const panel = UIHelper.renderResultPanel('Overflow Analysis', html);
        visual.appendChild(panel);

        ProgressTracker.completeModule(MODULE_ID);
        UIHelper.markModuleComplete(MODULE_ID);
        btn.textContent = 'Complete!';
    }

    return { init: init };
})();
