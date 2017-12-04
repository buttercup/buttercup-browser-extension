import { createAction } from "redux-actions";
import { APP_MASTER_SET, APP_SET_BUSY, APP_UNSET_BUSY } from "./types.js";

export const setBusy = createAction(APP_SET_BUSY);
export const setEntireState = createAction(APP_MASTER_SET);
export const unsetBusy = createAction(APP_UNSET_BUSY);
