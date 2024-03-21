import { isError, Layerr } from "layerr";
import { t } from "../i18n/trans.js";

export function errorToString(error: Error | Layerr): string {
    return localisedErrorMessage(error);
}

export function localisedErrorMessage(error: Error | Layerr): string {
    if (!isError(error)) {
        return `${error}`;
    }
    const { i18n } = Layerr.info(error);
    if (i18n) {
        const translated = t(i18n);
        if (translated) return translated;
    }
    return error.message;
}

export function stringToError(error: Error | Layerr | string): Layerr | Error {
    if (isError(error as Error)) return error as Error;
    const isI18N = /^[a-z0-9_-]+(\.[a-z0-9_-]+){1,}$/i.test(error as string);
    return isI18N ? new Error(t(error as string)) : new Error(error as string);
}
