import { combineReducers } from "redux";
import archives from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";
import dropbox from "../../shared/reducers/dropbox.js";
import searching from "../../shared/reducers/searching.js";

const rootReducer = combineReducers({
    app,
    archives,
    dropbox,
    searching
});

export default rootReducer;
