import {
    MYBUTTERCUP_CLEAR_STATE,
    MYBUTTERCUP_SET_AUTH_ID,
    MYBUTTERCUP_SET_AUTH_TOKEN,
    MYBUTTERCUP_SET_ORG_ARCHIVES,
    MYBUTTERCUP_SET_ORGS
} from "../actions/types.js";

const INITIAL = {
    authenticationID: null,
    authToken: null,
    organisationArchives: {},
    organisations: []
};

export default function myButtercupReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case MYBUTTERCUP_CLEAR_STATE:
            return {
                ...state,
                authenticationID: null,
                authToken: null,
                organisationArchives: {},
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
        case MYBUTTERCUP_SET_ORG_ARCHIVES: {
            const { orgID, archives } = action.payload;
            return {
                ...state,
                organisationArchives: {
                    ...state.organisationArchives,
                    [`org-${orgID}`]: [...archives]
                }
            };
        }

        default:
            return state;
    }
}
