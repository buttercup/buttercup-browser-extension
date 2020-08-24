import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createSyncMiddleware, syncStore } from "redux-browser-extension-sync";
import createDialogReducer from "../reducers/index.js";
import history from "./history.js";

const reduxRouterMiddleware = routerMiddleware(history);
const syncMiddleware = createSyncMiddleware();

const store = syncStore(
    createStore(
        createDialogReducer(history),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        applyMiddleware(thunk, reduxRouterMiddleware, syncMiddleware)
    )
);

const { dispatch, getState } = store;

export default store;

export { dispatch, getState };
