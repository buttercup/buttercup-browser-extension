import { ARCHIVES_SET, ARCHIVES_SET_CURRENT } from "../actions/types.js";

const INITIAL = {
    archives: []
};

export default function archivesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVES_SET:
            return {
                ...state,
                archives: [...action.payload]
            };

        default:
            return state;
    }
}

export function currentArchiveReducer(state = null, action = {}) {
    switch (action.type) {
        case ARCHIVES_SET_CURRENT:
            return action.payload;
        default:
            return state;
    }
}
