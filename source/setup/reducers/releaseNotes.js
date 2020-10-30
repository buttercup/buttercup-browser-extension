import { RELEASE_NOTES_SET } from "../actions/types.js";

const INITIAL = {
    notes: null
};

export default function releaseNotesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case RELEASE_NOTES_SET:
            return {
                ...state,
                notes: action.payload
            };

        default:
            return state;
    }
}
