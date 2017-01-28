import React from "react";
import ReactDOM from "react-dom";
import {
    Router,
    Route,
    IndexRoute,
    hashHistory
} from "react-router";
import App from "./App";
import Home from "./Home";
import AddArchive from "./AddArchive";
import AddArchiveEntry from "./AddArchiveEntry";
import AddLastLogin from "./AddLastLogin";
import UnlockArchive from "./UnlockArchive";
import NoMatch from "./NoMatch";
import About from "./About";

import "index.sass";

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="addArchive" component={AddArchive} />
            <Route path="/addArchive/:type" component={AddArchiveEntry} />
            <Route path="addLastLogin" component={AddLastLogin} />
            <Route path="/unlockArchive/:name(/:action)" component={UnlockArchive} />
            <Route path="/about" component={About} />
            <Route path="*" component={NoMatch} />
        </Route>
    </Router>
), document.getElementById("app"));
