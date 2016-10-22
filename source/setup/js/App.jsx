'use strict';

const React = require("react");

const MainMenu  = require("./MainMenu");

class App extends React.Component {

    render() {
        return <div>
            <h2>Buttercup</h2>
            <MainMenu />
        </div>
    }

}

// App.contextTypes = {
//     router: React.PropTypes.object.isRequired,
// };

module.exports = App;
