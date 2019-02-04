const KEY = "autoLogin";

export function getAutoLoginDetails(state) {
    const { sourceID, entryID, tabID, setTime } = state[KEY];
    return { sourceID, entryID, tabID, setTime };
}
