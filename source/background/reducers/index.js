import { combineReducers } from "redux";
import archives from "../../shared/reducers/archives.js";
import app from "../../shared/reducers/app.js";

const rootReducer = combineReducers({
    app,
    archives
});

export default rootReducer;
