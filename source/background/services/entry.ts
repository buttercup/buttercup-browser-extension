import { SearchResult } from "buttercup";
import { createNewTab } from "../../shared/library/extension.js";
import { formatURL } from "../../shared/library/url.js";

export async function openEntryPageInNewTab(_: SearchResult, url: string): Promise<number> {
    const tab = await createNewTab(formatURL(url));
    if (typeof tab.id !== "number") {
        throw new Error("No tab ID for created tab");
    }
    return tab.id;
}
