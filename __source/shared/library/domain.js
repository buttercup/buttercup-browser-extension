export function extractDomain(str) {
    const domainMatch = str.match(/^https?:\/\/([^\/]+)/i);
    if (!domainMatch) return str;
    const [, domainPortion] = domainMatch;
    const [domain] = domainPortion.split(":");
    return domain;
}
