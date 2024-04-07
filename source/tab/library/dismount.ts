export function onElementDismount(el: HTMLElement, callback: () => void): void {
    let active = true,
        timer: ReturnType<typeof setTimeout>;
    const disconnect = () => {
        active = false;
        mutObs.disconnect();
        clearTimeout(timer);
    };
    const mutObs = new MutationObserver((records) => {
        if (!active) return;
        const wasRemoved = records.some((record) => {
            return [...record.removedNodes].includes(el);
        });
        if (wasRemoved) {
            disconnect();
            callback();
        }
    });
    if (!el.parentElement) {
        throw new Error("No parent element found for target");
    }
    mutObs.observe(el.parentElement, { childList: true });
    timer = setTimeout(() => {
        if (!el.parentElement) {
            disconnect();
            callback();
        }
    }, 50);
}
