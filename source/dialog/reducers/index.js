import { combineReducers } from "redux";
import { APP_MASTER_SET } from "../../shared/actions/types.js";
import dialogRouting from "./routing.js";

const appReducer = combineReducers({
    dialogRouting
});

const rootReducer = (state, action) => {
    if (action.type === APP_MASTER_SET) {
        // reset global state
        state = action.payload;
    }
    return appReducer(state, action);
};

export default rootReducer;
