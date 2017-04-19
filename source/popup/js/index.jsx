"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {
    Router,
    Route,
    // Link,
    // IndexRoute,
    hashHistory
} from "react-router";

import App from "./App";

import "index.sass";

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            
        </Route>
    </Router>
), document.getElementById("app"));
