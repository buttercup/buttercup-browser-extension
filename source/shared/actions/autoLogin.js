import { createAction } from "redux-actions";
import { AUTOLOGIN_CLEAR_DETAILS, AUTOLOGIN_SET_DETAILS } from "./types.js";

export const clearAutoLogin = createAction(AUTOLOGIN_CLEAR_DETAILS);
export const setAutoLogin = createAction(AUTOLOGIN_SET_DETAILS);
