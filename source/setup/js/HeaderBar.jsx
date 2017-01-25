import React from "react";
import { Link } from "react-router";

import "HeaderBar.sass";

class HeaderBar extends React.Component {

    render() {
        return (
            <div id="header">
                <img className="logo" src="resources/buttercup-128.png" />
                <h1 className="heading">Buttercup</h1>
                <ul className="menu">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/addArchive">Add archive</Link></li>
                </ul>
            </div>
        );
    }

}

export default HeaderBar;
