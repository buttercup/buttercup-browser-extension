import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "./redux/index.js";
import history from "./redux/history.js";
import { connectToBackground } from "./library/messaging.js";
import SearchPage from "./containers/SearchPage.js";
import SaveNewCredentialsPage from "./containers/SaveNewCredentialsPage.js";
import PasswordGeneratorPage from "./containers/PasswordGeneratorPage.js";

import "../shared/styles/base.sass";
import "./styles/dialog.sass";
import "../../resources/fontawesome/font-awesome.scss";

connectToBackground();

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div className="rootContainer">
                <Route exact path="/" component={SearchPage} />
                <Route path="/save-new-credentials" component={SaveNewCredentialsPage} />
                <Route path="/generate-password" component={PasswordGeneratorPage} />
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
