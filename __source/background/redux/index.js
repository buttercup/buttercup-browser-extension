import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { createSyncMiddleware, syncStore } from "redux-browser-extension-sync/background";
import reducer from "../reducers/index.js";

const syncMiddleware = createSyncMiddleware();

const store = syncStore(
    createStore(
        reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        applyMiddleware(thunk, syncMiddleware)
    )
);

const { dispatch, getState } = store;

export default store;

export { dispatch, getState };
