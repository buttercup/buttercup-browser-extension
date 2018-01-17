import { APP_SET_BUSY, APP_UNSET_BUSY } from "../actions/types.js";

const INITIAL = {
    busy: false,
    busyMessage: ""
};

export default function archivesReducer(state = INITIAL, action = {}) {
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

        default:
            return state;
    }
}
