"use strict";

const React = require("react");

class App extends React.Component {

    render() {
        return (
            <main>
                {this.props.children}
            </main>
        );
    }

}

module.exports = App;
