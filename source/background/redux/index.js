import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { createSyncMiddleware, syncStore } from "redux-browser-extension-sync/background";
import reducer from "../reducers/index.js";

const syncMiddleware = createSyncMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = syncStore(createStore(reducer, composeEnhancer(applyMiddleware(thunk, syncMiddleware))));

const { dispatch, getState } = store;

export default store;

export { dispatch, getState };
