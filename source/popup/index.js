import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "./redux/index.js";
import history from "./redux/history.js";
import ArchivesListPage from "./containers/ArchivesListPage.js";
import EntriesPage from "./containers/EntriesPage.js";
import MenuPage from "./containers/MenuPage.js";
import HeaderBar from "./containers/HeaderBar.js";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../shared/styles/base.sass";
import "./styles/popup.sass";
import "../../resources/fontawesome/font-awesome.scss";

ReactDOM.render(
    <Provider store={store}>
        <Fragment>
            <HeaderBar />
            <ConnectedRouter history={history}>
                <Fragment>
                    <Route exact path="/" component={EntriesPage} />
                    <Route path="/entries" component={ArchivesListPage} />
                    <Route path="/menu" component={MenuPage} />
                </Fragment>
            </ConnectedRouter>
        </Fragment>
    </Provider>,
    document.getElementById("root")
);
