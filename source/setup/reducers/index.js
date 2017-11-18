import { combineReducers } from "redux";
import { APP_MASTER_SET } from "../../shared/actions/types.js";
import setupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import addArchive from "./addArchive.js";

const appReducer = combineReducers({
    addArchive,
    archives,
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
