import path from "path";
import React from "react";

import RemoteFileExplorer from "./RemoteFileExplorer";
import Rodal from "rodal";

import "ConnectArchiveDialog.sass";

const { Component, PropTypes } = React;
const BUTTERCUP_FILE = /\.bcup$/i;

class ConnectArchiveDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allowSelectArchive: true,
            createNew: false,
            currentOption: "existing",
            explorerActive: false,
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
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            explorerActive: nextProps.explorerActive
        });
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
                                <div className="row">
                                    <input
                                        id="connect-existing-cb"
                                        type="checkbox"
                                        value="existing"
                                        checked={this.state.currentOption === "existing"}
                                        onChange={(e) => this.onOptionChange(e)}
                                        />
                                    <label htmlFor="connect-existing-cb">Select existing archive</label>
                                </div>
                                <hr />
                                <div className="row">
                                    <input
                                        id="connect-new-cb"
                                        type="checkbox"
                                        value="new"
                                        checked={this.state.currentOption === "new"}
                                        onChange={(e) => this.onOptionChange(e)}
                                        />
                                    <label htmlFor="connect-new-cb">Create new archive</label>
                                </div>
                                <div className="row">
                                    <input
                                        className="short"
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
                                active={this.state.explorerActive}
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
    explorerActive:         PropTypes.bool,
    onArchiveSelected:      PropTypes.func
};

export default ConnectArchiveDialog;
