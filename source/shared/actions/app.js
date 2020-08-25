import { createAction } from "redux-actions";
import {
    APP_SET_BUSY,
    APP_UNSET_BUSY,
    APP_SET_CONFIG,
    APP_SET_CONFIG_VALUE,
    APP_SET_USER_ACTIVITY,
    APP_SET_UNSAVED_LOGINS_COUNT,
} from "./types.js";

export const setBusy = createAction(APP_SET_BUSY);
export const setConfig = createAction(APP_SET_CONFIG);
export const setConfigValue = createAction(APP_SET_CONFIG_VALUE);
export const setUnsavedLoginsCount = createAction(APP_SET_UNSAVED_LOGINS_COUNT);
export const setUserActivity = createAction(APP_SET_USER_ACTIVITY);
export const unsetBusy = createAction(APP_UNSET_BUSY);
