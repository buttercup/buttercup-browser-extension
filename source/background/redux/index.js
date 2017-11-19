import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers/index.js";
import { createSyncMiddleware } from "./sync.js";

import { addArchive } from "../../shared/actions/archives.js";

const syncMiddleware = createSyncMiddleware();

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk, syncMiddleware)
);

const { dispatch, getState } = store;

export default store;

export { dispatch, getState };

setTimeout(() => {
    dispatch(
        addArchive({
            id: "1",
            title: "Perry's archive",
            type: "owncloud",
            state: "unlocked"
        })
    );
}, 1000);
