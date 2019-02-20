import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "./redux/index.js";
import history from "./redux/history.js";
import AddArchivePage from "./containers/AddArchivePage.js";
import ArchiveUnlockPage from "./containers/ArchiveUnlockPage.js";
import LoadingModal from "./containers/LoadingModal.js";
import SaveCredentialsPage from "./containers/SaveCredentialsPage.js";
import AboutPage from "./components/AboutPage.js";
import UnlockAllArchivesPage from "./containers/UnlockAllArchivesPage.js";
import VaultPage from "./containers/VaultPage.js";
import App from "../shared/containers/App.js";
import { trackMouseMovement } from "../shared/library/mouseEvents.js";
import { trackKeydownEvent } from "../shared/library/keyboardEvents.js";

import "react-select/dist/react-select.css";

import "../shared/styles/base.sass";
import "./styles/setup.sass";

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App>
                <Route path="/add-archive" component={AddArchivePage} />
                <Route path="/access-archive/:id/:state" component={ArchiveUnlockPage} />
                <Route path="/save-new-credentials" component={SaveCredentialsPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/unlock" component={UnlockAllArchivesPage} />
                <Route path="/vault/:id" component={VaultPage} />
                <LoadingModal />
            </App>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);

// Track mousemove events for user activity tracking
trackMouseMovement();

// Track keystrokes for user activity tracking
trackKeydownEvent();
