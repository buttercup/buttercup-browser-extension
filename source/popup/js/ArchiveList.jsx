'use strict';

const React = require("react");

const ArchiveListElement = require("./ArchiveListElement");

class ArchiveList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            archives: []
        };
    }

    componentWillMount() {
        this.fetchArchives();
    }

    fetchArchives() {
        Buttercup
            .fetchArchives()
            .then(archives => {
                this.state.archives = archives;
            });
    }

    render() {
        return (
            <ul>
                {this.state.archives.map(archive =>
                    <li>
                        <ArchiveListElement {...archive} key={archive.name} />
                    </li>
                )}
            </ul>
        );
    }

}

module.exports = ArchiveList;
