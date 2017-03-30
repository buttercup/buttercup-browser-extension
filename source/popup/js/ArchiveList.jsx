import React from "react";

import ArchiveListElement from "./ArchiveListElement";

import "ArchiveList.sass";

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
                //         { name: "Test archive 1", status: "locked", type: "webdav" },
                //         { name: "Test archive 2", status: "locked", type: "owncloud" },
                //         { name: "Test archive 3", status: "locked", type: "dropbox" },
                //         { name: "Test archive 4", status: "locked", type: "owncloud" },
                //         { name: "Test archive 5", status: "processing", type: "dropbox" },
                //         { name: "Test archive 6", status: "locked", type: "webdav" },
                //         { name: "Test archive 7", status: "unlocked", type: "dropbox" }
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
                    <div className="noArchives">
                        <i>No archives... yet.</i>
                    </div>
                }
            </div>
        );
    }

}

export default ArchiveList;
