"use strict";

const React = require("react");

class ArchiveList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            archives: []
        };
    }

    componentWillMount() {
        chrome.runtime.sendMessage({ command: "get-archive-states" }, (response) => {
            this.onArchivesUpdate(response);
        });
    }

    onArchivesUpdate(archives) {
        this.setState({ archives });
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.archives.map(archive =>
                        <li key={archive.name}>{ archive.name }</li>
                    )}
                </ul>
            </div>
        );
    }

}

module.exports = ArchiveList;
