import { getCurrentTitle, getCurrentURL } from "./page.js";

let __sharedTracker = null;

export default class LoginTracker {
    _url = getCurrentURL();
    _title = getCurrentTitle();
    _connections = [];

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }

    getConnection(loginTarget) {
        return this._connections.find(conn => conn.loginTarget === loginTarget);
    }

    registerConnection(loginTarget) {
        this._connections.push({
            loginTarget,
            username: "",
            password: ""
        });
    }
}

export function getSharedTracker() {
    if (!__sharedTracker) {
        __sharedTracker = new LoginTracker();
    }
    return __sharedTracker;
}
