import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import styled from "styled-components";
import store from "./redux/index.js";
import history from "./redux/history.js";
import ArchivesListPage from "./containers/ArchivesListPage.js";
import EntriesPage from "./containers/EntriesPage.js";
import HeaderBar from "./containers/HeaderBar.js";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../shared/styles/base.sass";
import "./styles/popup.sass";
import "../../resources/fontawesome/font-awesome.scss";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0.5rem;
`;

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Fragment>
                <HeaderBar />
                <Container>
                    <Route exact path="/" component={EntriesPage} />
                    <Route path="/vaults" component={ArchivesListPage} />
                </Container>
            </Fragment>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
