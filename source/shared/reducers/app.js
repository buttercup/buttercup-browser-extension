import { APP_SET_BUSY, APP_UNSET_BUSY, APP_SET_CONFIG } from "../actions/types.js";

const INITIAL_CONFIG = {
    darkMode: true
};

const INITIAL = {
    busy: false,
    busyMessage: "",
    config: INITIAL_CONFIG
};

export default function appReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case APP_SET_BUSY:
            return {
                ...state,
                busy: true,
                busyMessage: action.payload
            };
        case APP_UNSET_BUSY:
            return {
                ...state,
                busy: false,
                busyMessage: ""
            };
        case APP_SET_CONFIG:
            return {
                ...state,
                config: {
                    ...state.config,
                    [action.payload.key]: action.payload.value
                }
            };

        default:
            return state;
    }
}
