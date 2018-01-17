import { DROPBOX_CLEAR_STATE, DROPBOX_SET_AUTH_ID, DROPBOX_SET_AUTH_TOKEN } from "../actions/types.js";

const INITIAL = {
    authenticationID: null,
    authToken: null
};

export default function dropboxReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case DROPBOX_CLEAR_STATE:
            return {
                ...state,
                authenticationID: null,
                authToken: null
            };
        case DROPBOX_SET_AUTH_ID:
            return {
                ...state,
                authenticationID: action.payload
            };
        case DROPBOX_SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.payload
            };

        default:
            return state;
    }
}
