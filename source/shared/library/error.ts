import { Layerr } from "layerr";
import { t } from "../i18n/trans.js";

export function localisedErrorMessage(error: Error | Layerr): string {
    const { i18n } = Layerr.info(error);
    if (i18n) {
        return t(i18n);
    }
    return error.message;
}
