import { SearchResult } from "buttercup";
import { createNewTab } from "../../shared/library/extension.js";

export async function openEntryPageInNewTab(_: SearchResult, url: string): Promise<void> {
    await createNewTab(url);
}
