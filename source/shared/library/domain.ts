import { EntryURLType, PropertyKeyValueObject, getEntryURLs } from "buttercup";

export function extractDomain(str: string): string {
    const domainMatch = str.match(/^https?:\/\/([^\/]+)/i);
    if (!domainMatch) return str;
    const [, domainPortion] = domainMatch;
    const [domain] = domainPortion.split(":");
    return domain;
}

export function extractEntryDomain(entryProperties: PropertyKeyValueObject): string | null {
    const [url] = [
        ...getEntryURLs(entryProperties, EntryURLType.Icon),
        ...getEntryURLs(entryProperties, EntryURLType.Any)
    ];
    return url ? extractDomain(url) : null;
}
