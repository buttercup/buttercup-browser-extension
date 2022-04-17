export function onElementDismount(el, callback) {
    let active = true,
        timer;
    const disconnect = () => {
        active = false;
        mutObs.disconnect();
        clearTimeout(timer);
    };
    const mutObs = new MutationObserver(records => {
        if (!active) return;
        const wasRemoved = records.some(record => {
            return [...record.removedNodes].includes(el);
        });
        if (wasRemoved) {
            disconnect();
            callback();
        }
    });
    mutObs.observe(el.parentElement, { childList: true });
    timer = setTimeout(() => {
        if (!el.parentElement) {
            disconnect();
            callback();
        }
    }, 50);
}
