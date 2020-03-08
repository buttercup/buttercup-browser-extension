import { extractDomain } from "../shared/library/domain.js";

export function currentDomainDisabled(disabledDomains, currentDomain = getCurrentDomain()) {
    return disabledDomains.some(disabledDomain => {
        const idx = currentDomain.indexOf(disabledDomain);
        return idx === currentDomain.length - disabledDomain.length;
    });
}

export function getCurrentDomain() {
    return extractDomain(getCurrentURL());
}

export function getCurrentTitle() {
    return document.title;
}

export function getCurrentURL() {
    return window.location.href;
}
