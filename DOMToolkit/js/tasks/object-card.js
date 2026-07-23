'use strict';

function initObjectCard() {
    const btn = document.querySelector('#scan-planet-btn');
    if (!btn) { return; }

    const image = document.querySelector('#object-card-image');
    const infoBlock = document.querySelector('#object-card-info');
    const caption = document.querySelector('#object-card-caption');

    btn.addEventListener('click', async () => {
        if (!image || !infoBlock) { return; }

        const rawName = image.getAttribute('alt') || 'Unknown Object';
        const type = image.getAttribute('data-type') || 'unknown';
        const distance = image.getAttribute('data-distance') || 'Unknown';
        const icon = TYPE_ICONS[type] || '';

        if (caption) { caption.textContent = rawName; }

        const warningText = document.querySelector('#warning-text');
        if (warningText && warningText.textContent.includes('hazardous')) {
            warningText.textContent = warningText.textContent.replace('hazardous', '***');
        }

        const censoredName = rawName.replace(/./g, '*');
        const displayName = rawName.length > 6 ? censoredName.slice(0, 6) + rawName.slice(6) : rawName;

        infoBlock.innerHTML = '';
        const scanText = createEl('div', 'empty-state', 'Scanning');
        infoBlock.appendChild(scanText);
        await animateDots(scanText, 'Scanning', 600);

        infoBlock.innerHTML = '';
        const typeName = type.charAt(0).toUpperCase() + type.slice(1);
        const descriptionLines =
            `${icon} <strong>${escapeHtml(displayName)}</strong> is a classified cosmic ` +
            `${escapeHtml(type)} within the explored sector.<br>` +
            `Current tracking distance: <strong>${escapeHtml(distance)}</strong> from mission control.<br>` +
            `Classification: ${escapeHtml(typeName)} — ongoing observation recommended.`;

        infoBlock.appendChild(createEl('div', 'object-name', `${icon} ${escapeHtml(displayName)}`));
        infoBlock.appendChild(createEl('div', 'object-type', 'Type: ' + escapeHtml(type)));
        infoBlock.appendChild(createEl('div', 'object-distance', 'Distance: ' + escapeHtml(distance)));
        infoBlock.appendChild(createEl('div', 'object-description', descriptionLines));
        await renderModule(infoBlock);

        addLogEntry('Celestial object scanned: ' + displayName);
        showModuleResult('object-card', '✅ Celestial object scanned successfully.', 'success');
        completeModule('object-card');
    });
}
