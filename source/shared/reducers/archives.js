import { ARCHIVES_SET } from "../actions/types.js";

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
