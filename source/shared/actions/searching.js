import { createAction } from "redux-actions";
import { SEARCH_SET_ENTRY_RESULTS, SEARCH_SET_SOURCES_COUNT } from "./types.js";

export const setEntrySearchResults = createAction(SEARCH_SET_ENTRY_RESULTS);
export const setSourcesCount = createAction(SEARCH_SET_SOURCES_COUNT);
