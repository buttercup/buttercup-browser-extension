export function onBodyWidthResize(callback) {
    let lastWidth = 0;
    const watch = setInterval(() => {
        const newWidth = document.body.offsetWidth;
        if (newWidth !== lastWidth) {
            callback(newWidth, lastWidth);
            lastWidth = newWidth;
        }
    }, 200);
    return {
        remove: () => {
            clearInterval(watch);
        }
    };
}
