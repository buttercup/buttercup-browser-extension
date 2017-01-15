"use strict";

const path = require("path");
const React = require("react");

const RemoteFileExplorer = require("./RemoteFileExplorer");
const Rodal = require("rodal").default;

const { Component, PropTypes } = React;

require("ConnectArchiveDialog.sass");

class ConnectArchiveDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allowSelectArchive: true,
            archivePath: "",
            createNew: false,
            currentOption: "existing",
            filename: "",
            modalVisible: false
        };
    }

    get filename() {
        return this.state.filename.trim();
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    onFilenameChange(e) {
        this.setState({
            filename: e.target.value
        });
    }

    onOptionClick(e) {
        this.setState({
            allowSelectArchive: (e.target.value === "existing"),
            currentOption: e.target.value
        });
    }

    onSelectClick(e) {
        e.preventDefault();
        if (/\.bcup$/i.test(this.state.archivePath)) {
            this.props.onArchiveSelected(this.state.archivePath);
            this.hide();
        } else {
            alert("Please select a valid archive before continuing");
        }
    }

    onUpdateSelection(remotePath, type) {
        let archivePath = "",
            createNew = false;
        if (type === "directory" && this.filename.length >= 0) {
            createNew = true;
            archivePath = path.resolve(remotePath, this.filename);
        } else if (type === "file") {
            archivePath = remotePath;
        }
        this.setState({
            archivePath,
            createNew
        });
    }

    render() {
        return (
            <div>
                <button disabled={this.props.disabled} onClick={(e) => this.show(e)}>Browse</button>
                <Rodal 
                    visible={this.state.modalVisible}
                    onClose={() => this.hide()}
                    width={700}
                    height={400}
                    >
                    <div className="connectArchiveDialog">
                        <div className="configuration">
                            <h3>Options</h3>
                            <div className="options">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="existing"
                                        checked={this.state.currentOption === "existing"}
                                        onChange={(e) => this.onOptionClick(e)}
                                        />
                                    Select existing archive
                                </label>
                                <hr />
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="new"
                                            checked={this.state.currentOption === "new"}
                                            onChange={(e) => this.onOptionClick(e)}
                                            />
                                        Create new archive
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Filename:
                                        <input
                                            type="text"
                                            value={this.state.filename}
                                            onChange={(e) => this.onFilenameChange(e)}
                                            onBlur={() => this.updateFilename()}
                                            />
                                    </label>
                                </div>
                                <div>
                                    <button onClick={(e) => this.onSelectClick(e)}>
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="explorer">
                            <RemoteFileExplorer
                                fs={this.props.fs}
                                allowSelectArchive={this.state.allowSelectArchive}
                                onChoosePath={(...args) => this.onUpdateSelection(...args)}
                                />
                        </div>
                    </div>
                </Rodal>
            </div>
        );
    }

    show(e) {
        e.preventDefault();
        this.setState({ modalVisible: true });
    }

    updateFilename() {
        let filename = this.state.filename;
        if (/\.bcup$/i.test(filename) !== true) {
            this.setState({
                filename: `${filename}.bcup`
            });
        }
    }

}

ConnectArchiveDialog.propTypes = {
    onArchiveSelected:      PropTypes.func
};

module.exports = ConnectArchiveDialog;
