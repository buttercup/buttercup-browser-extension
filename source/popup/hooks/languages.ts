import { useMemo } from "react";
import { TRANSLATIONS } from "../../shared/i18n/trans.js";

export interface LanguageOption {
    key: string | null;
    name: string;
}

export function useLanguageOptions(): Array<LanguageOption> {
    const languages = useMemo(() => [], []);
    return languages;
}
