const KEY = "myButtercup";

export function getAccessToken(state) {
    return state[KEY].accessToken;
}

export function getAuthID(state) {
    return state[KEY].authenticationID;
}

export function getName(state) {
    return state[KEY].name;
}

export function getRefreshToken(state) {
    return state[KEY].refreshToken;
}

export function getVaultID(state) {
    return state[KEY].vaultID;
}
