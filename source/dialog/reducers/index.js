import { combineReducers } from "redux";
import { createSyncReducer } from "redux-browser-extension-sync";
import { emptyReducer } from "../../shared/library/reducers.js";
import { currentArchiveReducer as currentArchiveId } from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";
import searching from "../../shared/reducers/searching.js";
import dialogRouting from "./routing.js";

const appReducer = combineReducers({
    app,
    currentArchiveId,
    archives: emptyReducer,
    dialogRouting,
    dropbox: emptyReducer,
    searching
});

export default createSyncReducer(appReducer);
