import ms from "ms";
import { dispatch } from "../redux/index.js";
import { setUnsavedLoginsCount } from "../../shared/actions/app.js";

const LOGIN_MAX_AGE = ms("15m");

let __items = [],
    __updates = 0,
    __lastUpdate = 0;

export function cleanLogins() {
    const now = Date.now();
    const originalItems = __items.length;
    __items = __items
        .filter(item => {
            const age = now - item.timestamp;
            return age <= LOGIN_MAX_AGE;
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    if (__items.length !== originalItems) {
        __updates += 1;
    }
}

export function getLogins(tabID) {
    cleanLogins();
    return tabID === null ? [...__items] : __items.filter(item => item.tabID === tabID && item.prompt === true);
}

export function removeLogin(id) {
    __items = __items.filter(item => item.id !== id);
    __updates += 1;
}

export function stopPromptForTab(tabID) {
    __items = __items.map(item =>
        item.tabID === tabID
            ? {
                  ...item,
                  prompt: false,
              }
            : item
    );
}

export function updateLogin(targetID, tabID, credentials) {
    let item = __items.find(loginItem => loginItem.id === targetID);
    if (!item) {
        item = {
            id: targetID,
            tabID,
            prompt: true,
            timestamp: credentials.timestamp || Date.now(),
        };
        __items.unshift(item);
    }
    Object.assign(item, credentials);
    __updates += 1;
}

export function updateLoginsState() {
    if (__lastUpdate === __updates) return;
    __lastUpdate = __updates;
    dispatch(setUnsavedLoginsCount(__items.length));
}
