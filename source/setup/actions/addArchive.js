import { createAction } from "redux-actions";
import { ADD_ARCHIVE_SET_CONNECTED, ADD_ARCHIVE_SET_CONNECTING, ADD_ARCHIVE_SET_SELECTED_TYPE } from "./types.js";

export const setConnected = createAction(ADD_ARCHIVE_SET_CONNECTED);
export const setConnecting = createAction(ADD_ARCHIVE_SET_CONNECTING);
export const setSelectedArchiveType = createAction(ADD_ARCHIVE_SET_SELECTED_TYPE);
