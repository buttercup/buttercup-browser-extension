import { combineReducers } from "redux";
import { createSyncReducer } from "redux-browser-extension-sync";
import { emptyReducer } from "../../shared/library/reducers.js";
import app from "../../shared/reducers/app.js";
import searching from "../../shared/reducers/searching.js";
import dialogRouting from "./routing.js";

const appReducer = history =>
    createSyncReducer(
        combineReducers({
            app,
            archives: emptyReducer,
            router: dialogRouting(history),
            dropbox: emptyReducer,
            searching
        })
    );

export default appReducer;
