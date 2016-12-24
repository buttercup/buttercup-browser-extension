'use strict';

const React = require("react");

require("ArchiveList.sass");

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
                this.setState({ archives });
            });
    }

    render() {
        return (
            <ul className="archiveList">
                {this.state.archives.map(archive =>
                    <li key={archive.name}>
                        <ArchiveListElement {...archive} />
                    </li>
                )}
            </ul>
        );
    }

}

module.exports = ArchiveList;
