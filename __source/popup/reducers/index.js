import { combineReducers } from "redux";
import { createSyncReducer } from "redux-browser-extension-sync";
import popupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";
import searching from "../../shared/reducers/searching.js";

const appReducer = combineReducers({
    app,
    archives,
    popupRouting,
    searching
});

export default createSyncReducer(appReducer);
