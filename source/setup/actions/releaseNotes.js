import { createAction } from "redux-actions";
import { RELEASE_NOTES_SET } from "./types.js";

export const setReleaseNotes = createAction(RELEASE_NOTES_SET);
