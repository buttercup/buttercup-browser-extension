import { sendStateUpdate } from "../library/messaging.js";
import { canSendAction, markActionAsSynchronised } from "../../shared/library/stateSync.js";

export function createSyncMiddleware() {
    return () => next => action => {
        if (canSendAction(action)) {
            // mark as having been sync'd
            markActionAsSynchronised(action);
            // send the state update
            sendStateUpdate(action);
        }
        // continue with the next middleware
        next(action);
    };
}
