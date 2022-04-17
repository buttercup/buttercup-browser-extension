const KEY = "googleDrive";

export function getAccessToken(state) {
    return state[KEY].accessToken;
}

export function getAuthID(state) {
    return state[KEY].authenticationID;
}

export function getAuthCode(state) {
    return state[KEY].authCode;
}

export function getRefreshToken(state) {
    return state[KEY].refreshToken;
}
