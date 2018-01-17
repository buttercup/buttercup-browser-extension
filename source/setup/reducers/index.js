import { combineReducers } from "redux";
import { APP_MASTER_SET } from "../../shared/actions/types.js";
import setupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";
import addArchive from "./addArchive.js";
import dropbox from "../../shared/reducers/dropbox.js";
import manageArchive from "./manageArchive.js";
import remoteFiles from "./remoteFiles.js";

const appReducer = combineReducers({
    app,
    addArchive,
    archives,
    dropbox,
    manageArchive,
    remoteFiles,
    setupRouting
});

const rootReducer = (state, action) => {
    if (action.type === APP_MASTER_SET) {
        // reset global state
        state = action.payload;
    }
    return appReducer(state, action);
};

export default rootReducer;
