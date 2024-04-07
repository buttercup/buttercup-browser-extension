import { EntryURLType, PropertyKeyValueObject, getEntryURLs } from "buttercup";
import { ParseResultListed, ParseResultType, parseDomain } from "parse-domain";

export function domainsReferToSameParent(domain1: string, domain2: string): boolean {
    if (domain1 === domain2) return true;
    const res1 = parseDomain(domain1);
    const res2 = parseDomain(domain2);
    if (res1.type !== res2.type) return false;
    if (res1.type !== ParseResultType.Listed) return false;
    const r1 = (res1 as ParseResultListed).icann;
    const r2 = (res2 as ParseResultListed).icann;
    if (r1.topLevelDomains.join(".") !== r2.topLevelDomains.join(".")) return false;
    return r1.domain === r2.domain;
}

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
