import { createLog as createLogger, toggleContext } from "gle";

export type Logger = ReturnType<typeof createLog>;

export function createLog(name: string, force: boolean = false): (...args: Array<any>) => void {
    if (force) {
        toggleContext(name, true);
    }
    return createLogger(name);
}
