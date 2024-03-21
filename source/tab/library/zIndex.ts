export function findBestZIndexInContainer(parentElement: HTMLElement): number {
    let highest: number = 0;
    [...parentElement.children].forEach((child) => {
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
