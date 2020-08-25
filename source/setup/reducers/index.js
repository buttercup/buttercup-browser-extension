import { combineReducers } from "redux";
import { createSyncReducer } from "redux-browser-extension-sync";
import setupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";
import addArchive from "./addArchive.js";
import dropbox from "../../shared/reducers/dropbox.js";
import googleDrive from "../../shared/reducers/googleDrive.js";
import manageArchive from "./manageArchive.js";
import releaseNotes from "./releaseNotes.js";
import remoteFiles from "./remoteFiles.js";
import searching from "../../shared/reducers/searching.js";
import vault from "./vault.js";
import myButtercup from "../../shared/reducers/mybuttercup.js";

const createAppReducer = history =>
    createSyncReducer(
        combineReducers({
            router: setupRouting(history),
            app,
            addArchive,
            archives,
            dropbox,
            googleDrive,
            manageArchive,
            myButtercup,
            releaseNotes,
            remoteFiles,
            searching,
            vault,
        })
    );

export default createAppReducer;
