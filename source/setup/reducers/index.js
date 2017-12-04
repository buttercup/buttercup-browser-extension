import { combineReducers } from "redux";
import { APP_MASTER_SET } from "../../shared/actions/types.js";
import setupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";
import addArchive from "./addArchive.js";
import webdav from "./webdav.js";

const appReducer = combineReducers({
    app,
    addArchive,
    archives,
    setupRouting,
    webdav
});

const rootReducer = (state, action) => {
    if (action.type === APP_MASTER_SET) {
        // reset global state
        state = action.payload;
    }
    return appReducer(state, action);
};

export default rootReducer;
