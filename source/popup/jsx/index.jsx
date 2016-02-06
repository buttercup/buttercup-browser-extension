/** @jsx React.DOM */
"use strict";

var React = require("react"),
    ReactDOM = require("react-dom");

var Router = require("react-router").Router,
    Route = require("react-router").Route,
    Link = require("react-router").Link,
    IndexRoute = require("react-router").IndexRoute,
    browserHistory = require("react-router").browserHistory;

var App = require("./App"),
    Intro = require("./Intro"),
    AddArchive = require("./AddArchive");

//ReactDOM.render(<Intro />, document.getElementById("app"));

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Intro} />
            <Route path="addArchive" component={AddArchive}/>
        </Route>
    </Router>
), document.getElementById("app"));
