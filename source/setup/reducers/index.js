import { combineReducers } from "redux";
import { createSyncReducer } from "redux-browser-extension-sync";
import setupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";
import addArchive from "./addArchive.js";
import dropbox from "../../shared/reducers/dropbox.js";
import manageArchive from "./manageArchive.js";
import releaseNotes from "./releaseNotes.js";
import remoteFiles from "./remoteFiles.js";
import searching from "../../shared/reducers/searching.js";

const appReducer = combineReducers({
    app,
    addArchive,
    archives,
    dropbox,
    manageArchive,
    releaseNotes,
    remoteFiles,
    searching,
    setupRouting
});

export default createSyncReducer(appReducer);
