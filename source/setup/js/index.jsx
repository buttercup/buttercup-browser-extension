"use strict";

const React = require("react"),
    ReactDOM = require("react-dom");

const {
    Router,
    Route,
    Link,
    IndexRoute,
    hashHistory
} = require("react-router");

const App = require("./App"),
    // AddArchive = require("./AddArchive"),
    // AddWebDAV = require("./AddWebDAV"),
    LoadingModal = require("./LoadingModal");

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            {/*<Route path="addArchive" component={AddArchive}/>
            <Route path="addArchive/webdav" component={AddWebDAV}/>*/}
            <Route path="loading" component={LoadingModal}/>
        </Route>
    </Router>
), document.getElementById("app"));
