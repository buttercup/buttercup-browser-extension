import { createAction } from "redux-actions";
import {
    GOOGLE_DRIVE_CLEAR_STATE,
    GOOGLE_DRIVE_SET_ACCESS_TOKEN,
    GOOGLE_DRIVE_SET_AUTH_ID,
    GOOGLE_DRIVE_SET_AUTH_CODE,
    GOOGLE_DRIVE_SET_REFRESH_TOKEN
} from "./types.js";

export const clearGoogleDriveState = createAction(GOOGLE_DRIVE_CLEAR_STATE);
export const setAccessToken = createAction(GOOGLE_DRIVE_SET_ACCESS_TOKEN);
export const setAuthID = createAction(GOOGLE_DRIVE_SET_AUTH_ID);
export const setAuthCode = createAction(GOOGLE_DRIVE_SET_AUTH_CODE);
export const setRefreshToken = createAction(GOOGLE_DRIVE_SET_REFRESH_TOKEN);
