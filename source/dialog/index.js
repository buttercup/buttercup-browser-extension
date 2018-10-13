import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "./redux/index.js";
import history from "./redux/history.js";
import SearchPage from "./containers/SearchPage.js";
import SaveNewCredentialsPage from "./containers/SaveNewCredentialsPage.js";
import PasswordGeneratorPage from "./containers/PasswordGeneratorPage.js";

import "../shared/styles/base.sass";
import "./styles/dialog.sass";

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Fragment>
                <Route exact path="/" component={SearchPage} />
                <Route path="/save-new-credentials" component={SaveNewCredentialsPage} />
                <Route path="/generate-password" component={PasswordGeneratorPage} />
            </Fragment>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
