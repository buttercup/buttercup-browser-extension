import { combineReducers } from "redux";
import { APP_MASTER_SET } from "../../shared/actions/types.js";
import { emptyReducer } from "../../shared/library/reducers.js";
import app from "../../shared/reducers/app.js";
import searching from "../../shared/reducers/searching.js";
import dialogRouting from "./routing.js";

const appReducer = combineReducers({
    app,
    archives: emptyReducer,
    dialogRouting,
    dropbox: emptyReducer,
    searching
});

const rootReducer = (state, action) => {
    if (action.type === APP_MASTER_SET) {
        // reset global state
        state = action.payload;
    }
    return appReducer(state, action);
};

export default rootReducer;
