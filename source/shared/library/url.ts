export function formatURL(base: string): string {
    if (/^\d+\.\d+\.\d+\.\d+/.test(base)) {
        return `http://${base}`;
    } else if (/^https?:\/\//i.test(base) === false) {
        return `https://${base}`;
    }
    return base;
}
