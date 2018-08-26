import { createAction } from "redux-actions";
import {
    MYBUTTERCUP_CLEAR_STATE,
    MYBUTTERCUP_SET_AUTH_ID,
    MYBUTTERCUP_SET_AUTH_TOKEN,
    MYBUTTERCUP_SET_ORG_ARCHIVES,
    MYBUTTERCUP_SET_ORGS
} from "./types.js";

export const clearMyButtercupState = createAction(MYBUTTERCUP_CLEAR_STATE);
export const setAuthID = createAction(MYBUTTERCUP_SET_AUTH_ID);
export const setAuthToken = createAction(MYBUTTERCUP_SET_AUTH_TOKEN);
export const setOrganisationArchives = createAction(MYBUTTERCUP_SET_ORG_ARCHIVES);
export const setOrganisations = createAction(MYBUTTERCUP_SET_ORGS);
