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
                // this.setState({
                //     archives: [
                //         { name: "Test archive 1", status: "locked" },
                //         { name: "Test archive 2", status: "locked" },
                //         { name: "Test archive 3", status: "locked" },
                //         { name: "Test archive 4", status: "locked" },
                //         { name: "Test archive 5", status: "processing" },
                //         { name: "Test archive 6", status: "locked" },
                //         { name: "Test archive 7", status: "unlocked" }
                //     ]
                // });
                this.setState({ archives });
            });
    }

    render() {
        return (
            <div>
                {this.state.archives.length > 0 ?
                    <ul className="archiveList">
                        {this.state.archives.map(archive =>
                            <ArchiveListElement
                                key={archive.name}
                                {...archive}
                                onLocked={() => this.fetchArchives()}
                                />
                        )}
                    </ul> :
                    <div style={{ textAlign: "center" }}>
                        <i>No archives... yet.</i>
                    </div>
                }
            </div>
        );
    }

}

module.exports = ArchiveList;
