const KEY = "myButtercup";

export function getAuthID(state) {
    return state[KEY].authenticationID;
}

export function getAuthToken(state) {
    return state[KEY].authToken;
}

export function getOrganisationArchives(state) {
    return state[KEY].organisationArchives;
}

export function getOrganisations(state) {
    return state[KEY].organisations;
}
