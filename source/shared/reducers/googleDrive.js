import {
    GOOGLE_DRIVE_CLEAR_STATE,
    GOOGLE_DRIVE_SET_ACCESS_TOKEN,
    GOOGLE_DRIVE_SET_AUTH_ID,
    GOOGLE_DRIVE_SET_AUTH_CODE,
    GOOGLE_DRIVE_SET_REFRESH_TOKEN
} from "../actions/types.js";

const INITIAL = {
    accessToken: null,
    authenticationID: null,
    authCode: null,
    refreshToken: null
};

export default function googleDriveReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case GOOGLE_DRIVE_CLEAR_STATE:
            return {
                ...state,
                accessToken: null,
                authenticationID: null,
                authCode: null,
                refreshToken: null
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
        case GOOGLE_DRIVE_SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.payload
            };
        case GOOGLE_DRIVE_SET_REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: action.payload
            };

        default:
            return state;
    }
}
