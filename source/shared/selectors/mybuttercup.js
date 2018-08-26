const KEY = "myButtercup";

export function getAuthID(state) {
    return state[KEY].authenticationID;
}

export function getAuthToken(state) {
    return state[KEY].authToken;
}
