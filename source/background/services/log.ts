import { createLog } from "../../shared/library/log.js";

const LOG_NAME = "buttercup:browser:background";

let __logger: ReturnType<typeof createLog>;

export function log(...args: Array<any>): void {
    if (!__logger) {
        __logger = createLog(LOG_NAME);
    }
    return __logger(...args);
}
