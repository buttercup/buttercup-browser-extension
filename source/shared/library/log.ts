import { createLog as createLogger, toggleContext } from "gle";

export function createLog(name: string, force: boolean = false): (...args: Array<any>) => void {
    if (force) {
        toggleContext(name, true);
    }
    return createLogger(name);
}
