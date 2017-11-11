const ACTION_SYNC_PROP = "actionSync";
const ACTION_BLACKLIST = /^(@@|app\/masterSetState)/;

let __actionCounter = 0;

export function canSendAction(action) {
    if (action && ACTION_BLACKLIST.test(action.type)) {
        // Don't sync blacklisted actions
        return false;
    }
    return typeof action[ACTION_SYNC_PROP] !== "number";
}

export function markActionAsSynchronised(action) {
    action[ACTION_SYNC_PROP] = __actionCounter;
    __actionCounter += 1;
}
