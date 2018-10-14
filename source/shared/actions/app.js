import { createAction } from "redux-actions";
import { APP_SET_BUSY, APP_UNSET_BUSY, APP_SET_CONFIG } from "./types.js";

export const setBusy = createAction(APP_SET_BUSY);
export const unsetBusy = createAction(APP_UNSET_BUSY);
export const setConfig = createAction(APP_SET_CONFIG);
