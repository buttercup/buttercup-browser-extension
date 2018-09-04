import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { createSyncMiddleware, syncStore } from "redux-browser-extension-sync/background";
import reducer from "../reducers/index.js";

// const ACTION_BLACKLIST = /^@@/;
// const ACTION_SYNC_PROP = "@@actionSync";
// const ACTION_TYPE_SET_STATE = "@@reduxBrowserSync/setState";
// const REQUEST_TYPE_SYNC_EMITFULL = "@@reduxBrowserSync/syncReqEmitFull";
// const REQUEST_TYPE_SYNC_FULL = "@@reduxBrowserSync/syncFullToTab";
// const REQUEST_TYPE_SYNC_TO_BG = "@@reduxBrowserSync/syncToBg";
// const REQUEST_TYPE_SYNC_TO_TAB = "@@reduxBrowserSync/syncToTab";
// let __actionCounter = 0;
// function sendStateUpdate(action) {
//     const work = new Promise(resolve => chrome.tabs.query({}, tabs => resolve(tabs)));
//     return work
//         .then(tabs => {
//             tabs.forEach(tab => {
//                 console.log("SEND TO TAB", tab.id, tab.windowType);
//                 chrome.tabs.sendMessage(tab.id, {
//                     type: "@@reduxBrowserSync/syncToTab",
//                     action
//                 });
//             });
//             // handle popup
//             console.log("SEND TO POPUP");
//             chrome.runtime.sendMessage({
//                 type: REQUEST_TYPE_SYNC_TO_TAB,
//                 action
//             });
//         });
// }
// function canSendAction(action) {
//     if (action && ACTION_BLACKLIST.test(action.type)) {
//         // Don't sync blacklisted actions
//         return false;
//     }
//     return typeof action[ACTION_SYNC_PROP] !== "number";
// }
// function markActionAsSynchronised(action) {
//     // Store count on action prop
//     action[ACTION_SYNC_PROP] = __actionCounter;
//     __actionCounter += 1;
// }
// function createTestSyncMiddleware() {
//     return () => next => action => {
//         if (canSendAction(action)) {
//             console.log("CAN SYNC", action);
//             // mark as having been sync'd
//             markActionAsSynchronised(action);
//             // send the state update
//             sendStateUpdate(action);
//         } else {
//             console.log("CANNOT SYNC", action);
//         }
//         // continue with the next middleware
//         next(action);
//     };
// }

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
