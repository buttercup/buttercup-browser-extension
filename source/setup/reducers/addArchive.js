import {
    ADD_ARCHIVE_SET_SELECTED_TYPE
} from "../actions/types.js";

const INITIAL = {
    selectedArchiveType: null
};

export default function addArchiveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ADD_ARCHIVE_SET_SELECTED_TYPE:
            return {
                ...state,
                selectedArchiveType: action.payload
            };

        default:
            return state;
    }
}
