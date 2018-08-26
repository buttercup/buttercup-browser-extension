import { createAction } from "redux-actions";
import { MYBUTTERCUP_CLEAR_STATE, MYBUTTERCUP_SET_AUTH_ID, MYBUTTERCUP_SET_AUTH_TOKEN } from "./types.js";

export const clearMyButtercupState = createAction(MYBUTTERCUP_CLEAR_STATE);
export const setAuthID = createAction(MYBUTTERCUP_SET_AUTH_ID);
export const setAuthToken = createAction(MYBUTTERCUP_SET_AUTH_TOKEN);
