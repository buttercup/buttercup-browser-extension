import React from "react";
import { Link } from "react-router";

class NoMatch extends React.Component {

    render() {
        return (
            <div>
                <h3>Bad link</h3>
                <Link to="/">Return home</Link>
            </div>
        );
    }

}

export default NoMatch;
