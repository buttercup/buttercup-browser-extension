import { ARCHIVES_SET, ARCHIVES_SET_COUNT, ARCHIVES_UNLOCKED_SET_COUNT } from "../actions/types.js";

const INITIAL = {
    archives: [],
    unlocked: 0,
    total: 0,
};

export default function archivesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVES_SET:
            return {
                ...state,
                archives: [...action.payload],
            };
        case ARCHIVES_SET_COUNT:
            return {
                ...state,
                total: action.payload,
            };
        case ARCHIVES_UNLOCKED_SET_COUNT:
            return {
                ...state,
                unlocked: action.payload,
            };

        default:
            return state;
    }
}
