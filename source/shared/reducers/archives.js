import { ARCHIVES_ADD } from "../actions/types.js";

const INITIAL = {
    archives: []
};

export default function archivesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVES_ADD:
            return {
                ...state,
                archives: [...state.archives, action.payload]
            };

        default:
            return state;
    }
}
