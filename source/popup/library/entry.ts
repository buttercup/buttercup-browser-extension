import { SearchResult } from "buttercup";

export function extractFirstOTPURI(entry: SearchResult): string | null {
    let key: string, value: string;
    for (const prop in entry.properties) {
        if (!/^otpauth:\/\//.test(entry.properties[prop])) continue;
        if (!key || prop.length < key.length) {
            key = prop;
            value = entry.properties[prop];
        }
    }
    return value ?? null;
}
