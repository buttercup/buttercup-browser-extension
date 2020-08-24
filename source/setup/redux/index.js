import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createSyncMiddleware, syncStore } from "redux-browser-extension-sync";
import createAppReducer from "../reducers/index.js";
import history from "./history.js";

const reduxRouterMiddleware = routerMiddleware(history);
const syncMiddleware = createSyncMiddleware();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = syncStore(
    createStore(
        createAppReducer(history),
        composeEnhancer(applyMiddleware(thunk, reduxRouterMiddleware, syncMiddleware))
    )
);

const { dispatch, getState } = store;

export default store;

export { dispatch, getState };
