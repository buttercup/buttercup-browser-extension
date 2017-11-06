import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import store from "./redux/index.js";
import history from "./redux/history.js";
import { connectToBackground } from "./library/messaging.js";
import MainPage from "./containers/MainPage.js";

import "./styles/base.sass";
import "../../resources/fontawesome/font-awesome.scss";

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Route exact path="/" component={MainPage} />
                {/*<Route path="/publisher/:id/scripts" component={ScriptsPage} />
                <Route path="/publisher/:pubid/script/:scriptid/templates" component={TemplatesPage} />*/}
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);

setTimeout(() => {
    connectToBackground();
}, 0);
