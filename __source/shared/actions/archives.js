import { createAction } from "redux-actions";
import { ARCHIVES_SET, ARCHIVES_SET_COUNT, ARCHIVES_UNLOCKED_SET_COUNT } from "./types.js";

export const setArchives = createAction(ARCHIVES_SET);
export const setArchivesCount = createAction(ARCHIVES_SET_COUNT);
export const setUnlockedArchivesCount = createAction(ARCHIVES_UNLOCKED_SET_COUNT);
