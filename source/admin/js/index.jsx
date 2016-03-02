"use strict";

const React = require("react"),
    ReactDOM = require("react-dom");

const {
    Router,
    Route,
    Link,
    IndexRoute,
    browserHistory
} = require("react-router");

let App = require("./App"),
    AddArchive = require("./AddArchive"),
    AddWebDAV = require("./AddWebDAV");

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="addArchive" component={AddArchive}/>
            <Route path="addArchive/webdav" component={AddWebDAV}/>
            {/*<Route path="addArchive" component={AddArchive}/>
            <Route path="addArchive/webdav" component={AddWebDAV}/>*/}
        </Route>
    </Router>
), document.getElementById("app"));
