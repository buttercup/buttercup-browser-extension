import { createAction } from "redux-actions";
import { DROPBOX_CLEAR_STATE, DROPBOX_SET_AUTH_ID, DROPBOX_SET_AUTH_TOKEN } from "./types.js";

export const clearDropboxState = createAction(DROPBOX_CLEAR_STATE);
export const setAuthID = createAction(DROPBOX_SET_AUTH_ID);
export const setAuthToken = createAction(DROPBOX_SET_AUTH_TOKEN);
