import { SearchResult } from "buttercup";
import { createNewTab } from "../../shared/library/extension.js";

function formatURL(base: string): string {
    if (/^\d+\.\d+\.\d+\.\d+/.test(base)) {
        return `http://${base}`;
    } else if (/^https?:\/\//i.test(base) === false) {
        return `https://${base}`;
    }
    return base;
}

export async function openEntryPageInNewTab(_: SearchResult, url: string): Promise<number> {
    const tab = await createNewTab(formatURL(url));
    return tab.id;
}
