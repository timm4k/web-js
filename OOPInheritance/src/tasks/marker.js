"use strict";

App.renderMarker = function (container) {
    const marker = new RefillableMarker('#b366ff', 100);
    let totalCharsPrinted = 0;

    const hierarchy = document.createElement('div');
    hierarchy.className = 'hierarchy-block';
    hierarchy.innerHTML = '<span class="hierarchy-label">Class</span><span class="hierarchy-name">Marker</span><span class="hierarchy-label">Inheritance</span><span class="hierarchy-chain">RefillableMarker → Marker</span>';

    const purpose = document.createElement('div');
    purpose.className = 'purpose-block';
    purpose.textContent = 'Type text below and click Print to simulate marker usage. Each non‑space character consumes 0.5% ink. Use Refill to restore ink. The progress bar and stats update automatically with every action';

    const display = document.createElement('div');
    display.className = 'marker-display';

    const colorBox = document.createElement('div');
    colorBox.className = 'marker-color-box';
    colorBox.style.background = marker.color;

    const info = document.createElement('div');
    info.className = 'marker-info';

    const colorItem = document.createElement('div');
    colorItem.className = 'marker-info-item';
    colorItem.innerHTML = '<span class="marker-info-label">Color</span><span class="marker-info-value" style="color:' + marker.color + '">' + marker.color + '</span>';

    info.appendChild(colorItem);
    display.appendChild(colorBox);
    display.appendChild(info);

    const progressWrap = document.createElement('div');
    progressWrap.className = 'progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-bar-fill high';
    progressFill.style.width = '100%';
    progressWrap.appendChild(progressFill);

    const controls = document.createElement('div');
    controls.className = 'controls';

    const textGroup = document.createElement('div');
    textGroup.className = 'controls-group';

    const textLabel = document.createElement('div');
    textLabel.className = 'controls-label';
    textLabel.textContent = 'Text to print';

    const textarea = document.createElement('textarea');
    textarea.className = 'ink-input';
    textarea.placeholder = 'Type something to print...';

    textGroup.appendChild(textLabel);
    textGroup.appendChild(textarea);

    const printGroup = document.createElement('div');
    printGroup.className = 'controls-group';

    const printLabel = document.createElement('div');
    printLabel.className = 'controls-label';
    printLabel.textContent = 'Action';

    const printBtn = document.createElement('button');
    printBtn.className = 'btn primary';
    printBtn.textContent = 'Print';

    printGroup.appendChild(printLabel);
    printGroup.appendChild(printBtn);

    const refillGroup = document.createElement('div');
    refillGroup.className = 'controls-group';

    const refillLabel = document.createElement('div');
    refillLabel.className = 'controls-label';
    refillLabel.textContent = 'Refill amount';

    const refillRow = document.createElement('div');
    refillRow.className = 'controls-row';

    const refillInput = document.createElement('input');
    refillInput.type = 'number';
    refillInput.className = 'ink-refill';
    refillInput.min = '1';
    refillInput.max = '100';
    refillInput.value = '50';

    const refillBtn = document.createElement('button');
    refillBtn.className = 'btn refill';
    refillBtn.textContent = 'Refill';

    refillRow.appendChild(refillInput);
    refillRow.appendChild(refillBtn);
    refillGroup.appendChild(refillLabel);
    refillGroup.appendChild(refillRow);

    controls.appendChild(textGroup);
    controls.appendChild(printGroup);
    controls.appendChild(refillGroup);

    const printResult = document.createElement('div');
    printResult.className = 'result-box';
    printResult.id = 'marker-result';
    printResult.style.color = marker.color;
    printResult.style.borderColor = 'rgba(179, 102, 255, 0.15)';

    const stats = document.createElement('div');
    stats.className = 'stats-grid';

    const inkStat = document.createElement('div');
    inkStat.className = 'stat-box';
    inkStat.innerHTML = '<div class="stat-value" id="marker-ink">100%</div><div class="stat-label">Ink</div>';

    const printedStat = document.createElement('div');
    printedStat.className = 'stat-box';
    printedStat.innerHTML = '<div class="stat-value" id="marker-printed">0</div><div class="stat-label">Characters printed</div>';

    const remainStat = document.createElement('div');
    remainStat.className = 'stat-box';
    remainStat.innerHTML = '<div class="stat-value" id="marker-remain">200</div><div class="stat-label">Characters remaining</div>';

    stats.appendChild(inkStat);
    stats.appendChild(printedStat);
    stats.appendChild(remainStat);

    const statusMsg = document.createElement('div');
    statusMsg.className = 'status-message';
    statusMsg.id = 'marker-status';

    function updateDisplay() {
        const ink = marker.inkAmount;
        const charsRemain = Math.floor(ink / 0.5);

        document.getElementById('marker-ink').textContent = Math.floor(ink) + '%';
        document.getElementById('marker-printed').textContent = totalCharsPrinted;
        document.getElementById('marker-remain').textContent = charsRemain;

        progressFill.style.width = ink + '%';

        if (ink > 50) {
            progressFill.className = 'progress-bar-fill high';
        } else if (ink > 20) {
            progressFill.className = 'progress-bar-fill medium';
        } else {
            progressFill.className = 'progress-bar-fill low';
        }

        if (ink <= 0) {
            statusMsg.className = 'status-message warning';
            statusMsg.textContent = 'The marker has run out of ink. Please refill it.';
        } else if (ink < 20) {
            statusMsg.className = 'status-message warning';
            statusMsg.textContent = 'Low ink! Only ' + Math.floor(ink) + '% remaining.';
        } else {
            statusMsg.className = 'status-message';
            statusMsg.textContent = '';
        }
    }

    function handlePrint() {
        const text = textarea.value;
        if (text.length === 0) {
            return;
        }

        if (marker.inkAmount <= 0) {
            statusMsg.className = 'status-message warning';
            statusMsg.textContent = 'The marker has run out of ink. Please refill it.';
            return;
        }

        const printed = marker.print(text);
        let printedCount = 0;
        for (let i = 0; i < printed.length; i++) {
            if (printed[i] !== ' ') {
                printedCount++;
            }
        }
        totalCharsPrinted += printedCount;

        printResult.textContent = printed;
        printResult.style.color = marker.color;
        printResult.style.borderColor = marker.color;

        statusMsg.className = 'status-message success';
        statusMsg.textContent = 'Printed ' + printed.length + ' characters';

        updateDisplay();
    }

    function handleRefill() {
        const amount = parseInt(refillInput.value, 10);
        if (isNaN(amount) || amount <= 0) {
            return;
        }

        marker.refill(amount);

        statusMsg.className = 'status-message success';
        statusMsg.textContent = 'Refilled by ' + amount + '%. Ink: ' + Math.floor(marker.inkAmount) + '%';

        updateDisplay();
    }

    printBtn.addEventListener('click', handlePrint);
    refillBtn.addEventListener('click', handleRefill);

    container.appendChild(hierarchy);
    container.appendChild(purpose);
    container.appendChild(display);
    container.appendChild(progressWrap);
    container.appendChild(controls);
    container.appendChild(stats);
    container.appendChild(printResult);
    container.appendChild(statusMsg);

    updateDisplay();
};
