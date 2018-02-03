let __lastCredentials = null;

export function clearLastLogin() {
    __lastCredentials = null;
}

export function getLastLogin() {
    return __lastCredentials;
}

export function saveLastLogin(credentials) {
    __lastCredentials = credentials;
}
