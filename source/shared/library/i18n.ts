export function getLanguage(/*preferences: Preferences, locale: string*/): string {
    // return preferences.language || locale || DEFAULT_LANGUAGE;
    return window.navigator.language;
}
