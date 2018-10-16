import { APP_SET_BUSY, APP_UNSET_BUSY, APP_SET_CONFIG, APP_SET_CONFIG_VALUE } from "../actions/types.js";
import { INITIAL_CONFIG } from "../library/config.js";

const INITIAL = {
    busy: false,
    busyMessage: "",
    config: { ...INITIAL_CONFIG },
    configSource: "app"
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
                    ...action.payload.config
                },
                configSource: action.payload.source
            };
        case APP_SET_CONFIG_VALUE:
            return {
                ...state,
                config: {
                    ...state.config,
                    [action.payload.key]: action.payload.value
                },
                configSource: "app"
            };

        default:
            return state;
    }
}
