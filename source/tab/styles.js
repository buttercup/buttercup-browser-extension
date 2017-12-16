export const CLEAR_STYLES = {
    margin: "0px",
    minWidth: "0px",
    minHeight: "0px",
    padding: "0px"
};

export function findBestZIndexInContainer(parentElement) {
    let highest = 0;
    Array.prototype.slice.call(parentElement.children).forEach(child => {
        const { zIndex } = window.getComputedStyle(child);
        if (zIndex) {
            const num = parseInt(zIndex, 10);
            if (!isNaN(num) && num > highest) {
                highest = num;
            }
        }
    });
    return highest + 1;
}
