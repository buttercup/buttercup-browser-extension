import i18next, { TOptions } from "i18next";

import en from "./translations/en.json";
import nl from "./translations/nl.json";

export const DEFAULT_LANGUAGE = "en";
export const TRANSLATIONS = {
    en, // Keep as first item
    // All others sorted alphabetically:
    nl
};

export async function changeLanguage(lang: string) {
    await i18next.changeLanguage(lang);
}

export async function initialise(lang: string) {
    await i18next.init({
        lng: lang,
        fallbackLng: DEFAULT_LANGUAGE,
        debug: false,
        resources: Object.keys(TRANSLATIONS).reduce(
            (output, lang) => ({
                ...output,
                [lang]: {
                    translation: TRANSLATIONS[lang]
                }
            }),
            {}
        )
    });
}

export function onLanguageChanged(callback: (lang: string) => void): () => void {
    const cb = (lang: string) => callback(lang);
    i18next.on("languageChanged", cb);
    return () => {
        i18next.off("languageChanged", cb);
    };
}

export function t(key: string, options?: TOptions) {
    return i18next.t(key, options);
}
