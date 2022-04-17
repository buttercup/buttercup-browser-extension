import { createLog as createLogger } from "gle";

export function createLog(name: string): (...args: Array<any>) => void {
    return createLogger(name);
}
