import { UsedCredentials } from "../types.js";

export function extractDomainFromCredentials(credentials: UsedCredentials): string | null {
    const match = /^https?:\/\/([^\/]+)/.exec(credentials.url);
    return match ? match[1] : null;
}
