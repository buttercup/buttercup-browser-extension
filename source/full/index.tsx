import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App.jsx";
import { initialise } from "./services/init.js";
import "../shared/styles/base.sass";
import "./styles/base.sass";

initialise()
    .then(() => {
        ReactDOM.render(
            <App />,
            document.getElementById("root"),
        );
    })
    .catch(err => {
        console.error(err);
    });
