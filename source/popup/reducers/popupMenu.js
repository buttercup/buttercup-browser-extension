import {
    POPUP_MENU_STATE_SHOW_ARCHIVES,
    POPUP_MENU_STATE_SHOW_OPTIONS,
    POPUP_MENU_STATE_TOGGLE
} from "../actions/types.js";

const INITIAL = {
    menuState: "archives"
};

export default function popupMenuReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case POPUP_MENU_STATE_SHOW_ARCHIVES:
            return {
                ...state,
                menuState: "archives"
            };
        case POPUP_MENU_STATE_SHOW_OPTIONS:
            return {
                ...state,
                menuState: "options"
            };
        case POPUP_MENU_STATE_TOGGLE:
            return {
                ...state,
                menuState: state.menuState === "archives" ? "options" : "archives"
            };

        default:
            return state;
    }
}
