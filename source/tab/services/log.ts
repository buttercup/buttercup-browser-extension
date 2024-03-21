import { Logger, createLog } from "../../shared/library/log.js";

const LOG_NAME = "buttercup:browser:tab";

let __logger: Logger;

export function log(...args: Array<any>): void {
    if (!__logger) {
        __logger = createLog(LOG_NAME, true);
    }
    return __logger(...args);
}
