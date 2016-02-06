/** @jsx React.DOM */
"use strict";

var React = require("react"),
    ReactDOM = require("react-dom");

var Router = require("react-router").Router,
    Route = require("react-router").Route,
    Link = require("react-router").Link,
    browserHistory = require("react-router").browserHistory;

var Intro = require("./Intro"),
    AddArchive = require("./AddArchive");

//ReactDOM.render(<Intro />, document.getElementById("app"));

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={Intro}>
            <Route path="addArchive" component={AddArchive}/>
        </Route>
    </Router>
), document.getElementById("app"));
