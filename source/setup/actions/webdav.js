import { createAction } from "redux-actions";
import { WEBDAV_DIRECTORY_SET_CONTENTS, WEBDAV_DIRECTORY_SET_LOADING, WEBDAV_RESET } from "./types.js";

export const setDirectoryContents = createAction(WEBDAV_DIRECTORY_SET_CONTENTS);
export const setDirectoryLoading = createAction(WEBDAV_DIRECTORY_SET_LOADING);
export const resetContents = createAction(WEBDAV_RESET);
