import { onIdentifiedTarget } from "./login.js";

export function autoLogin(username, password) {
    const { remove } = onIdentifiedTarget(target => {
        remove();
        target.login(username, password);
    });
}
