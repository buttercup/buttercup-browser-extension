import { combineReducers } from "redux";
import { APP_MASTER_SET } from "../../shared/actions/types.js";
// import routing from "./routing.js";
// import publishers from "./publishers.js";
// import scripts from "./scripts.js";
// import domainGroups from "./domainGroups.js";
// import templates from "./templates.js";

const appReducer = combineReducers({
    // domainGroups,
    // publishers,
    // routing,
    // scripts,
    // templates
});

const rootReducer = (state, action) => {
    if (action.type === APP_MASTER_SET) {
        // reset global state
        state = action.payload;
    }
    return appReducer(state, action);
};

export default rootReducer;
