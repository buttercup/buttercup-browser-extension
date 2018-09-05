import { combineReducers } from "redux";
import { createSyncReducer } from "redux-browser-extension-sync";
import popupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import searching from "../../shared/reducers/searching.js";

const appReducer = combineReducers({
    archives,
    popupRouting,
    searching
});

export default createSyncReducer(appReducer);
