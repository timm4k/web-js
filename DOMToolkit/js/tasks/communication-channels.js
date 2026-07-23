'use strict';

function initCommunicationChannels() {
    const btn = document.querySelector('#analyze-channels-btn');
    if (!btn) { return; }

    const container = document.querySelector('#communication-channels-list');

    btn.addEventListener('click', async () => {
        if (!container) { return; }

        const links = container.querySelectorAll('a[data-channel-url]');

        for (let i = 0; i < links.length; i++) {
            await waitForMs(150);

            const link = links[i];
            const url = link.getAttribute('data-channel-url');
            const channelType = getChannelType(url);

            link.innerHTML = channelType.icon + ' ' + link.innerHTML;
            await renderModule(link);
        }

        await waitForMs(200);
        addLogEntry('Communication channels analyzed: ' + links.length + ' classified');
        showModuleResult('communication-channels', '✅ Communication channels analyzed. ' + links.length + ' channels classified.');
        completeModule('communication-channels');
    });
}
