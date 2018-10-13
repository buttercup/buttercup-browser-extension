import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import styled, { ThemeProvider } from "styled-components";
import { Classes } from "@blueprintjs/core";
import store from "./redux/index.js";
import history from "./redux/history.js";
import SearchPage from "./containers/SearchPage.js";
import SaveNewCredentialsPage from "./containers/SaveNewCredentialsPage.js";
import PasswordGeneratorPage from "./containers/PasswordGeneratorPage.js";
import themes from "../shared/themes.js";

const Container = styled.div`
    height: 100%;
`;

import "../shared/styles/base.sass";
import "./styles/dialog.sass";

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <ThemeProvider theme={themes.dark}>
                <Container className={Classes.DARK}>
                    <Route exact path="/" component={SearchPage} />
                    <Route path="/save-new-credentials" component={SaveNewCredentialsPage} />
                    <Route path="/generate-password" component={PasswordGeneratorPage} />
                </Container>
            </ThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
