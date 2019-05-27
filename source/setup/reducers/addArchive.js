import {
    ADD_ARCHIVE_CREATE_REMOTE_FILE,
    ADD_ARCHIVE_SELECT_REMOTE_FILE,
    ADD_ARCHIVE_SET_ADDING,
    ADD_ARCHIVE_SET_CONNECTED,
    ADD_ARCHIVE_SET_CONNECTING,
    ADD_ARCHIVE_SET_LOCAL_AUTH_KEY,
    ADD_ARCHIVE_SET_LOCAL_AUTH_STATUS,
    ADD_ARCHIVE_SET_MYBCUP_ACN_READY,
    ADD_ARCHIVE_SET_SELECTED_TYPE
} from "../actions/types.js";

const INITIAL = {
    accountReady: false,
    adding: false,
    connected: false,
    connecting: false,
    localAuthKey: "",
    localAuthStatus: "idle",
    selectedArchiveType: null,
    selectedRemoteFile: null,
    shouldCreateRemoteFile: false
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
        case ADD_ARCHIVE_SET_ADDING:
            return {
                ...state,
                adding: !!action.payload
            };
        case ADD_ARCHIVE_CREATE_REMOTE_FILE:
            return {
                ...state,
                selectedRemoteFile: action.payload,
                shouldCreateRemoteFile: true
            };
        case ADD_ARCHIVE_SELECT_REMOTE_FILE:
            return {
                ...state,
                selectedRemoteFile: action.payload,
                shouldCreateRemoteFile: false
            };
        case ADD_ARCHIVE_SET_LOCAL_AUTH_STATUS:
            return {
                ...state,
                localAuthStatus: action.payload
            };
        case ADD_ARCHIVE_SET_LOCAL_AUTH_KEY:
            return {
                ...state,
                localAuthKey: action.payload
            };
        case ADD_ARCHIVE_SET_MYBCUP_ACN_READY:
            return {
                ...state,
                accountReady: !!action.payload
            };

        default:
            return state;
    }
}
