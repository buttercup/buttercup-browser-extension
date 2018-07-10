import { combineReducers } from "redux";
import { APP_MASTER_SET } from "../../shared/actions/types.js";
import popupRouting from "./routing.js";
import archives from "../../shared/reducers/archives.js";
import searching from "../../shared/reducers/searching.js";

const appReducer = combineReducers({
    archives,
    popupRouting,
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
