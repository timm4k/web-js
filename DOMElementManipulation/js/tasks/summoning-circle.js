window.SummoningCircle = (function () {
    'use strict';

    const MODULE_ID = 'summoning-circle';

    function init() {
        const card = DOMHelper.query('[data-module-id="' + MODULE_ID + '"]');
        if (!card) return;
        const visual = DOMHelper.query('.card__visual', card);
        const btn = DOMHelper.query('.btn', card);
        if (!visual || !btn) return;

        const info = DOMHelper.create('p', {
            textContent: 'A block with position: absolute and no top/left. JS will calculate viewport-relative center coordinates',
            style: { fontSize: '13px', color: '#8b7aa8', marginBottom: '10px' },
        });
        visual.appendChild(info);

        btn.addEventListener('click', function () {
            btn.disabled = true;
            run(visual, btn);
        });
    }

    function measureViewport() {
        return { w: window.innerWidth, h: window.innerHeight };
    }

    function measureElement(el) {
        return { w: el.offsetWidth, h: el.offsetHeight };
    }

    function calculateCenter(vp, el) {
        return {
            left: Math.round((vp.w - el.w) / 2),
            top: Math.round((vp.h - el.h) / 2),
        };
    }

    function renderMeasurements(container, vp, el) {
        container.innerHTML =
            '<div style="display:grid;grid-template-columns:auto 1fr;gap:2px 12px;font-family:monospace;font-size:12px;">' +
                '<span style="color:#8b7aa8;">window.innerWidth</span><span style="color:#00e5ff;">' + vp.w + ' px</span>' +
                '<span style="color:#8b7aa8;">window.innerHeight</span><span style="color:#00e5ff;">' + vp.h + ' px</span>' +
                '<span style="color:#8b7aa8;">element.offsetWidth</span><span style="color:#00e5ff;">' + el.w + ' px</span>' +
                '<span style="color:#8b7aa8;">element.offsetHeight</span><span style="color:#00e5ff;">' + el.h + ' px</span>' +
            '</div>';
    }

    function renderFormula(container, vp, el, pos) {
        container.innerHTML =
            '<div style="font-family:monospace;font-size:12px;line-height:1.8;">' +
                'left = (<span style="color:#00e5ff;">' + vp.w + '</span> - <span style="color:#00e5ff;">' + el.w + '</span>) / 2 = <span style="color:#4ade80;">' + pos.left + ' px</span><br>' +
                'top  = (<span style="color:#00e5ff;">' + vp.h + '</span> - <span style="color:#00e5ff;">' + el.h + '</span>) / 2 = <span style="color:#4ade80;">' + pos.top + ' px</span>' +
            '</div>';
    }

    async function run(visual, btn) {
        const overlay = DOMHelper.create('div', {
            style: {
                position: 'fixed', inset: '0', zIndex: '9999',
                background: 'rgba(15,10,26,0.92)', backdropFilter: 'blur(6px)',
            },
        });

        const circle = DOMHelper.create('div', {
            className: 'summoning-circle',
            style: {
                position: 'absolute',
                width: '140px', height: '140px',
                fontSize: '32px',
                transition: 'none',
            },
        }, ['⭐']);
        overlay.appendChild(circle);

        const panel = DOMHelper.create('div', {
            style: {
                position: 'fixed', top: '20px', right: '20px', zIndex: '10001',
                width: '280px', background: 'rgba(30,20,60,0.95)', border: '1px solid rgba(180,130,255,0.2)',
                borderRadius: '12px', padding: '16px',
            },
        });

        const stepLabel = DOMHelper.create('div', {
            style: { fontSize: '11px', color: '#8b7aa8', fontFamily: 'monospace', marginBottom: '12px' },
        }, ['Waiting...']);

        const measTitle = DOMHelper.create('div', {
            style: { fontWeight: '600', color: '#d4b8ff', marginBottom: '8px', fontSize: '14px' },
        }, ['Measurements']);
        const measBox = DOMHelper.create('div', {
            style: { marginBottom: '16px' },
        });
        measBox.innerHTML = '<span style="color:#8b7aa8;font-size:12px;">Click Start to begin...</span>';

        const formulaTitle = DOMHelper.create('div', {
            style: { fontWeight: '600', color: '#d4b8ff', marginBottom: '8px', fontSize: '14px' },
        }, ['Formula']);
        const formulaBox = DOMHelper.create('div');
        formulaBox.innerHTML = '<span style="color:#8b7aa8;font-size:12px;">—</span>';

        const statusLine = DOMHelper.create('div', {
            style: {
                marginTop: '16px', padding: '8px',
                background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '8px', fontSize: '12px', color: '#4ade80', display: 'none',
            },
        }, ['Element centered']);

        panel.appendChild(stepLabel);
        panel.appendChild(measTitle);
        panel.appendChild(measBox);
        panel.appendChild(formulaTitle);
        panel.appendChild(formulaBox);
        panel.appendChild(statusLine);

        const closeBtn = DOMHelper.create('button', {
            className: 'btn btn--secondary',
            textContent: 'Close',
            style: { position: 'fixed', bottom: '20px', right: '20px', zIndex: '10001' },
        });

        document.body.appendChild(overlay);
        document.body.appendChild(panel);
        document.body.appendChild(closeBtn);

        function cleanup() {
            window.removeEventListener('resize', onResize);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            if (panel.parentNode) panel.parentNode.removeChild(panel);
            if (closeBtn.parentNode) closeBtn.parentNode.removeChild(closeBtn);
            btn.disabled = false;
            btn.textContent = 'Start Experiment';
        }

        closeBtn.addEventListener('click', cleanup);

        await AnimationHelper.waitFor(400);

        stepLabel.textContent = 'Step 1 — Read viewport dimensions';
        const vp = measureViewport();
        renderMeasurements(measBox, vp, { w: 0, h: 0 });
        await AnimationHelper.waitFor(700);

        stepLabel.textContent = 'Step 2 — Read element dimensions';
        const el = measureElement(circle);
        renderMeasurements(measBox, vp, el);
        await AnimationHelper.waitFor(700);

        stepLabel.textContent = 'Step 3 — Calculate center coordinates';
        const pos = calculateCenter(vp, el);
        renderFormula(formulaBox, vp, el, pos);
        await AnimationHelper.waitFor(700);

        stepLabel.textContent = 'Step 4 — Apply style.left = ' + pos.left + 'px';
        circle.style.left = pos.left + 'px';
        await AnimationHelper.waitFor(500);

        stepLabel.textContent = 'Step 5 — Apply style.top = ' + pos.top + 'px';
        circle.style.top = pos.top + 'px';
        await AnimationHelper.waitFor(500);

        stepLabel.textContent = 'Element centered';
        statusLine.style.display = 'block';

        function onResize() {
            var vpNew = measureViewport();
            var elNew = measureElement(circle);
            var posNew = calculateCenter(vpNew, elNew);
            circle.style.left = posNew.left + 'px';
            circle.style.top = posNew.top + 'px';
            renderMeasurements(measBox, vpNew, elNew);
            renderFormula(formulaBox, vpNew, elNew, posNew);
        }

        window.addEventListener('resize', onResize);

        var resultHtml =
            '<strong>Centering Complete</strong><br>' +
            'viewport: <code>' + vp.w + ' x ' + vp.h + '</code><br>' +
            'element: <code>' + el.w + ' x ' + el.h + '</code><br>' +
            'left = (' + vp.w + ' - ' + el.w + ') / 2 = <code>' + pos.left + 'px</code><br>' +
            'top = (' + vp.h + ' - ' + el.h + ') / 2 = <code>' + pos.top + 'px</code><br><br>' +
            'Resize listener active — position updates on window resize.';

        var resultPanel = UIHelper.renderResultPanel('Result ★', resultHtml);
        visual.appendChild(resultPanel);

        ProgressTracker.completeModule(MODULE_ID);
        UIHelper.markModuleComplete(MODULE_ID);
        btn.textContent = 'Complete!';
    }

    return { init: init };
})();
