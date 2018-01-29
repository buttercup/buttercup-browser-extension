import { getCurrentTitle, getCurrentURL } from "./page.js";

let __sharedTracker = null;

export default class LoginTracker {
    constructor() {
        this.username = "";
        this.password = "";
        this._url = getCurrentURL();
        this._title = getCurrentTitle();
    }

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }
}

export function getSharedTracker() {
    if (!__sharedTracker) {
        __sharedTracker = new LoginTracker();
    }
    return __sharedTracker;
}
