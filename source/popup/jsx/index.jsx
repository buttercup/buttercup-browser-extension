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
