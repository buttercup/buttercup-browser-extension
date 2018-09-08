import { createAction } from "redux-actions";
import { ARCHIVES_SET, ARCHIVES_SET_CURRENT } from "./types.js";

export const setArchives = createAction(ARCHIVES_SET);
export const setCurrentArchiveId = createAction(ARCHIVES_SET_CURRENT);
