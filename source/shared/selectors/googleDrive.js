const KEY = "googleDrive";

export function getAuthID(state) {
    return state[KEY].authenticationID;
}

export function getAuthCode(state) {
    return state[KEY].authCode;
}
