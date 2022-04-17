import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { createSyncMiddleware, syncStore } from "redux-browser-extension-sync";
import reducer from "../reducers/index.js";
import history from "./history.js";

const reduxRouterMiddleware = routerMiddleware(history);
const syncMiddleware = createSyncMiddleware();

const store = syncStore(
    createStore(
        reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        applyMiddleware(thunk, reduxRouterMiddleware, syncMiddleware)
    )
);

const { dispatch, getState } = store;

export default store;

export { dispatch, getState };
