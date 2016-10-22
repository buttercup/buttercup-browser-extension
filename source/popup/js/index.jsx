"use strict";

const React = require("react");
const ReactDOM = require("react-dom");

const {
    Router,
    Route,
    Link,
    IndexRoute,
    hashHistory
} = require("react-router");

const App = require("./App");

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            
        </Route>
    </Router>
), document.getElementById("app"));
