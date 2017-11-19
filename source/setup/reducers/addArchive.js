import {
    ADD_ARCHIVE_SET_CONNECTED,
    ADD_ARCHIVE_SET_CONNECTING,
    ADD_ARCHIVE_SET_SELECTED_TYPE
} from "../actions/types.js";

const INITIAL = {
    connected: false,
    connecting: false,
    selectedArchiveType: null
};

export default function addArchiveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ADD_ARCHIVE_SET_SELECTED_TYPE:
            return {
                ...state,
                selectedArchiveType: action.payload
            };
        case ADD_ARCHIVE_SET_CONNECTING:
            return {
                ...state,
                connecting: !!action.payload
            };
        case ADD_ARCHIVE_SET_CONNECTED:
            return {
                ...state,
                connected: !!action.payload
            };

        default:
            return state;
    }
}
