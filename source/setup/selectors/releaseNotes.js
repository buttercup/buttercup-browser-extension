const KEY = "releaseNotes";

export function getReleaseNotes(state) {
    return state[KEY].notes;
}
