const KEY = "googleDrive";

export function getAuthID(state) {
    return state[KEY].authenticationID;
}

export function getAuthToken(state) {
    return state[KEY].authToken;
}
