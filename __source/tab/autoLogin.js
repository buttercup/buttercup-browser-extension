import { onIdentifiedTarget } from "./login.js";
import { getSharedTracker } from "./LoginTracker.js";

export function autoLogin(username, password) {
    const { remove } = onIdentifiedTarget(loginTarget => {
        remove();
        const tracker = getSharedTracker();
        const connection = tracker.getConnection(loginTarget);
        connection.entry = true;
        loginTarget.login(username, password);
    });
}
