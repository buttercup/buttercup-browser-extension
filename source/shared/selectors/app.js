const KEY = "app";

export function getBusyMessage(state) {
    return state[KEY].busyMessage;
}

export function shouldShowBusyModal(state) {
    return state[KEY].busy;
}

export function getConfig(state) {
    return state[KEY].config;
}

export function getConfigKey(state, key) {
    const config = getConfig(state);
    if (key in config) {
        return config[key];
    }
    return null;
}

export function getConfigSource(state) {
    return state[KEY].configSource;
}
