import { createAction } from "redux-actions";
import { POPUP_MENU_STATE_SHOW_ARCHIVES, POPUP_MENU_STATE_SHOW_OPTIONS, POPUP_MENU_STATE_TOGGLE } from "./types.js";

export const showArchivesMenu = createAction(POPUP_MENU_STATE_SHOW_ARCHIVES);
export const showOptionsMenu = createAction(POPUP_MENU_STATE_SHOW_OPTIONS);
export const toggleMenu = createAction(POPUP_MENU_STATE_TOGGLE);
