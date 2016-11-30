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

const App = require("./App");
const LoadingModal = require("./LoadingModal");
const MainMenu = require("./MainMenu");
const AddArchive = require("./AddArchive");
const AddArchiveEntry = require("./AddArchiveEntry");
const NoMatch = require("./NoMatch");

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={MainMenu} />
            {/*<Route path="addArchive" component={AddArchive}/>
            <Route path="addArchive/webdav" component={AddWebDAV}/>*/}
            <Route path="loading" component={LoadingModal} />
            <Route path="addArchive" component={AddArchive} />
            <Route path="/addArchive/:type" component={AddArchiveEntry} />
            <Route path="*" component={NoMatch} />
        </Route>
    </Router>
), document.getElementById("app"));
