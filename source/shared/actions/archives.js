import { createAction } from "redux-actions";
import { ARCHIVES_ADD, ARCHIVES_REMOVE, ARCHIVES_SET_LOCKED, ARCHIVES_SET_UNLOCKED } from "./types.js";

export const addArchive = createAction(ARCHIVES_ADD);
export const removeArchive = createAction(ARCHIVES_REMOVE);
export const setArchiveLocked = createAction(ARCHIVES_SET_LOCKED);
export const setArchiveUnlocked = createAction(ARCHIVES_SET_UNLOCKED);
