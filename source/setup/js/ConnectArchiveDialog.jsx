"use strict";

const path = require("path");
const React = require("react");

const RemoteFileExplorer = require("./RemoteFileExplorer");
const Rodal = require("rodal").default;

const { Component, PropTypes } = React;
const BUTTERCUP_FILE = /\.bcup$/i;

require("ConnectArchiveDialog.sass");

class ConnectArchiveDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allowSelectArchive: true,
            createNew: false,
            currentOption: "existing",
            filename: "",
            modalVisible: false,
            remoteDir: "/",
            selectedPath: ""
        };
    }

    get filename() {
        return this.state.filename.trim();
    }

    get finalPath() {
        if (this.state.createNew) {
            if (this.filename.length > 0 && this.state.remoteDir.length > 0) {
                return path.resolve(this.state.remoteDir, this.filename);
            }
        } else {
            return this.state.selectedPath;
        }
        return "";
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    onFilenameChange(e) {
        this.onOptionChange("new");
        this.setState({
            filename: e.target.value
        });
    }

    onOptionChange(e) {
        let newOption = (typeof e === "string") ? e : e.target.value;
        this.setState({
            allowSelectArchive: (newOption === "existing"),
            currentOption: newOption
        });
    }

    onSelectClick(e) {
        e.preventDefault();
        if (BUTTERCUP_FILE.test(this.finalPath)) {
            this.props.onArchiveSelected(this.finalPath, this.state.createNew);
            this.hide();
        } else {
            alert("Please select a valid archive before continuing");
        }
    }

    onUpdateSelection(filePath, type) {
        let selectedPath = "",
            createNew = false,
            remoteDir = this.state.remoteDir;
        if (type === "directory" && this.filename.length >= 0) {
            createNew = true;
            selectedPath = path.resolve(filePath, this.filename);
            remoteDir = filePath;
        } else if (type === "file") {
            selectedPath = filePath;
        }
        this.setState({
            selectedPath,
            createNew,
            remoteDir
        });
    }

    render() {
        return (
            <div className="dialogButtonView sameLine browse">
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
                                <div className="row check">
                                    <input
                                        type="checkbox"
                                        value="existing"
                                        checked={this.state.currentOption === "existing"}
                                        onChange={(e) => this.onOptionChange(e)}
                                        />
                                    <label onClick={() => this.onOptionChange("existing")}></label>
                                    <span>Select existing archive</span>
                                </div>
                                <hr />
                                <div className="row check">
                                    <input
                                        type="checkbox"
                                        value="new"
                                        checked={this.state.currentOption === "new"}
                                        onChange={(e) => this.onOptionChange(e)}
                                        />
                                    <label onClick={() => this.onOptionChange("new")}></label>
                                    <span>Create new archive</span>
                                </div>
                                <div className="row">
                                    <input
                                        type="text"
                                        value={this.state.filename}
                                        onChange={(e) => this.onFilenameChange(e)}
                                        onBlur={() => this.updateFilename()}
                                        />
                                    <label>Filename</label>
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
        if (BUTTERCUP_FILE.test(filename) !== true) {
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
