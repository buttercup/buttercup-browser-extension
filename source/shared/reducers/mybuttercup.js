import {
    MYBUTTERCUP_CLEAR_STATE,
    MYBUTTERCUP_SET_AUTH_ID,
    MYBUTTERCUP_SET_AUTH_TOKEN,
    MYBUTTERCUP_SET_ORGS
} from "../actions/types.js";

const INITIAL = {
    authenticationID: null,
    authToken: null,
    organisations: []
};

export default function myButtercupReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case MYBUTTERCUP_CLEAR_STATE:
            return {
                ...state,
                authenticationID: null,
                authToken: null,
                organisations: []
            };
        case MYBUTTERCUP_SET_AUTH_ID:
            return {
                ...state,
                authenticationID: action.payload
            };
        case MYBUTTERCUP_SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.payload
            };
        case MYBUTTERCUP_SET_ORGS:
            return {
                ...state,
                organisations: [...action.payload]
            };

        default:
            return state;
    }
}
