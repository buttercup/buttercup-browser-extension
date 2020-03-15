import ms from "ms";

const LOGIN_MAX_AGE = ms("15m");

let __items = [];

export function cleanLogins() {
    const now = Date.now();
    __items = __items
        .filter(item => {
            const age = now - item.timestamp;
            return age <= LOGIN_MAX_AGE;
        })
        .sort((a, b) => b.timestamp - a.timestamp);
}

export function getLogins(tabID) {
    cleanLogins();
    return tabID === null ? [...__items] : __items.filter(item => item.tabID === tabID);
}

export function updateLogin(targetID, tabID, credentials) {
    let item = __items.find(loginItem => loginItem.id === targetID);
    if (!item) {
        item = {
            id: targetID,
            tabID,
            timestamp: credentials.timestamp || Date.now()
        };
        __items.unshift(item);
    }
    Object.assign(item, credentials);
}
