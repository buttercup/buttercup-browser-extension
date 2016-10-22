'use strict';

const React = require("react");

class App extends React.Component {

    render() {
        return <div>
            <h2>Buttercup</h2>
            <a href="#" onClick={this.setupClicked}>Setup</a>
            { this.props.children }
        </div>
    }

    setupClicked(event) {
        event.preventDefault();
        chrome.tabs.create({'url': chrome.extension.getURL('dist/setup.html#/')}, function(tab) { });
    }

}

// App.contextTypes = {
//     router: React.PropTypes.object.isRequired,
// };

module.exports = App;
