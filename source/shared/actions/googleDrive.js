import { createAction } from "redux-actions";
import { GOOGLE_DRIVE_CLEAR_STATE, GOOGLE_DRIVE_SET_AUTH_ID, GOOGLE_DRIVE_SET_AUTH_CODE } from "./types.js";

export const clearGoogleDriveState = createAction(GOOGLE_DRIVE_CLEAR_STATE);
export const setAuthID = createAction(GOOGLE_DRIVE_SET_AUTH_ID);
export const setAuthCode = createAction(GOOGLE_DRIVE_SET_AUTH_CODE);
