import { createAction } from "redux-actions";
import { APP_MASTER_SET } from "./types.js";

export const setEntireState = createAction(APP_MASTER_SET);
