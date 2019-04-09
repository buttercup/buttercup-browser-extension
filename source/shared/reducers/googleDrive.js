import { GOOGLE_DRIVE_CLEAR_STATE, GOOGLE_DRIVE_SET_AUTH_ID, GOOGLE_DRIVE_SET_AUTH_CODE } from "../actions/types.js";

const INITIAL = {
    authenticationID: null,
    authCode: null
};

export default function googleDriveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case GOOGLE_DRIVE_CLEAR_STATE:
            return {
                ...state,
                authenticationID: null,
                authCode: null
            };
        case GOOGLE_DRIVE_SET_AUTH_ID:
            return {
                ...state,
                authenticationID: action.payload
            };
        case GOOGLE_DRIVE_SET_AUTH_CODE:
            return {
                ...state,
                authCode: action.payload
            };

        default:
            return state;
    }
}
