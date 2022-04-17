import { SEARCH_SET_ENTRY_RESULTS, SEARCH_SET_SOURCES_COUNT } from "../actions/types.js";

const INITIAL = {
    entryResults: [],
    sourcesCount: 0
};

export default function searchingReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case SEARCH_SET_ENTRY_RESULTS:
            return {
                ...state,
                entryResults: [...action.payload]
            };
        case SEARCH_SET_SOURCES_COUNT:
            return {
                ...state,
                sourcesCount: action.payload
            };

        default:
            return state;
    }
}
