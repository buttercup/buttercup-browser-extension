import { createAction } from "redux-actions";
import {
    MYBUTTERCUP_CLEAR_STATE,
    MYBUTTERCUP_SET_ACCESS_TOKEN,
    MYBUTTERCUP_SET_AUTH_ID,
    MYBUTTERCUP_SET_REFRESH_TOKEN
} from "./types.js";

export const clearMyButtercupState = createAction(MYBUTTERCUP_CLEAR_STATE);
export const setAccessToken = createAction(MYBUTTERCUP_SET_ACCESS_TOKEN);
export const setAuthID = createAction(MYBUTTERCUP_SET_AUTH_ID);
export const setRefreshToken = createAction(MYBUTTERCUP_SET_REFRESH_TOKEN);
