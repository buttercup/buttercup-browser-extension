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
                        <span>{ archive.name }</span>
                    )}
                </ul>
            </div>
        );
    }

}

module.exports = ArchiveList;
