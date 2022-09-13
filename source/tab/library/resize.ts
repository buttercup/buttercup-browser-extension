export function onBodyResize(
    callback: (newWidth: number, newHeight: number, lastWidth: number, lastHeight: number) => void
): () => void {
    let lastWidth = 0,
        lastHeight = 0;
    const watch = setInterval(() => {
        const newWidth = document.body.offsetWidth;
        const newHeight = document.body.offsetHeight;
        if (newWidth !== lastWidth || newHeight !== lastHeight) {
            callback(newWidth, newHeight, lastWidth, lastHeight);
            lastWidth = newWidth;
            lastHeight = newHeight;
        }
    }, 200);
    return () => {
        clearInterval(watch);
    };
}

export function onBodyWidthResize(callback: (newWidth: number, lastWidth: number) => void): () => void {
    let lastWidth = 0;
    const watch = setInterval(() => {
        const newWidth = document.body.offsetWidth;
        if (newWidth !== lastWidth) {
            callback(newWidth, lastWidth);
            lastWidth = newWidth;
        }
    }, 200);
    return () => {
        clearInterval(watch);
    };
}
