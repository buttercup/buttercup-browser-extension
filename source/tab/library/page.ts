import { extractDomain } from "../../shared/library/domain.js";

export function currentDomainDisabled(
    disabledDomains: Array<string>,
    currentDomain: string = getCurrentDomain()
): boolean {
    return disabledDomains.some((disabledDomain) => {
        const idx = currentDomain.indexOf(disabledDomain);
        return idx === currentDomain.length - disabledDomain.length;
    });
}

export function getCurrentDomain(): string {
    return extractDomain(getCurrentURL());
}

export function getCurrentTitle(): string {
    return document.title;
}

export function getCurrentURL(): string {
    return window.location.href;
}
