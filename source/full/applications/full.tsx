import React from "react";
import ReactDOM from "react-dom";
import { App } from "../components/App.js";
import { initialise } from "../services/init.js";

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
