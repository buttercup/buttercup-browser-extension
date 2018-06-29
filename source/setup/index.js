import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "./redux/index.js";
import history from "./redux/history.js";
import { connectToBackground } from "./library/messaging.js";
import AddArchivePage from "./containers/AddArchivePage.js";
import ArchiveUnlockPage from "./containers/ArchiveUnlockPage.js";
import ArchivesLockPage from "./containers/ArchivesLockPage.js";
import Notifier from "./components/Notifier.js";
import LoadingModal from "./containers/LoadingModal.js";
import SaveCredentialsPage from "./containers/SaveCredentialsPage.js";
import AboutPage from "./components/AboutPage.js";
import UnlockAllArchivesPage from "./containers/UnlockAllArchivesPage.js";

import "react-select/dist/react-select.css";

import "../shared/styles/base.sass";
import "./styles/setup.sass";
import "../../resources/fontawesome/font-awesome.scss";

connectToBackground();

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Route path="/add-archive" component={AddArchivePage} />
                <Route path="/access-archive/:id/:state" component={ArchiveUnlockPage} />
                <Route path="/lock-archives" component={ArchivesLockPage} />
                <Route path="/save-new-credentials" component={SaveCredentialsPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/unlock" component={UnlockAllArchivesPage} />
                <LoadingModal />
                <Notifier />
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
