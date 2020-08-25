import { createAction } from "redux-actions";
import {
    MYBUTTERCUP_CLEAR_STATE,
    MYBUTTERCUP_SET_ACCESS_TOKEN,
    MYBUTTERCUP_SET_AUTH_ID,
    MYBUTTERCUP_SET_NAME,
    MYBUTTERCUP_SET_REFRESH_TOKEN,
    MYBUTTERCUP_SET_VAULT_ID,
} from "./types.js";

export const clearMyButtercupState = createAction(MYBUTTERCUP_CLEAR_STATE);
export const setAccessToken = createAction(MYBUTTERCUP_SET_ACCESS_TOKEN);
export const setAuthID = createAction(MYBUTTERCUP_SET_AUTH_ID);
export const setName = createAction(MYBUTTERCUP_SET_NAME);
export const setRefreshToken = createAction(MYBUTTERCUP_SET_REFRESH_TOKEN);
export const setVaultID = createAction(MYBUTTERCUP_SET_VAULT_ID);
