import { createAction } from "redux-actions";
import { REMOTE_FILES_RESET, REMOTE_FILES_SET_CONTENTS, REMOTE_FILES_SET_LOADING } from "./types.js";

export const resetContents = createAction(REMOTE_FILES_RESET);
export const setDirectoryContents = createAction(REMOTE_FILES_SET_CONTENTS);
export const setDirectoryLoading = createAction(REMOTE_FILES_SET_LOADING);
