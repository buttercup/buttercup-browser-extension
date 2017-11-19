import log from "../../shared/library/log.js";
import { getPorts } from "./ports.js";

export function sendStateUpdate(action) {
    const ports = getPorts("state");
    log.info(`Sending state update to ${ports.length} ports`, action);
    ports.forEach(port => {
        try {
            port.postMessage({
                type: "action",
                action
            });
        } catch (err) {
            log.error(`Failed sending action to port: ${err.message}`);
            console.error(err);
        }
    });
}
