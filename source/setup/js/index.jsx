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
    LoadingModal = require("./LoadingModal"),
    AddArchive = require("./AddArchive"),
    NoMatch = require("./NoMatch");

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            {/*<Route path="addArchive" component={AddArchive}/>
            <Route path="addArchive/webdav" component={AddWebDAV}/>*/}
            <Route path="loading" component={LoadingModal} />
            <Route path="add-archive" component={AddArchive} />
            <Route path="*" component={NoMatch} />
        </Route>
    </Router>
), document.getElementById("app"));
