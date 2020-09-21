import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import store from "./redux";
import history from "./redux/history.js";
import SearchPage from "./containers/SearchPage.js";
import SaveNewCredentialsPage from "./containers/SaveNewCredentialsPage.js";
import PasswordGeneratorPage from "./containers/PasswordGeneratorPage.js";
import DisableSaveCredentialsPage from "./components/DisableSaveCredentialsPage.js";
import App from "../shared/containers/App.js";

import "../shared/styles/base.sass";
import "./styles/dialog.sass";

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App noBackgroundColor>
                <Route exact path="/" component={SearchPage} />
                <Route path="/save-new-credentials" exact component={SaveNewCredentialsPage} />
                <Route path="/save-new-credentials/disable" component={DisableSaveCredentialsPage} />
                <Route path="/generate-password" component={PasswordGeneratorPage} />
            </App>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
