"use strict";

const React = require("react");

const RemoteFileExplorer = require("./RemoteFileExplorer");
const Rodal = require("rodal").default;

require("ConnectArchiveDialog.sass");

class ConnectArchiveDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allowSelectArchive: true,
            currentOption: "existing",
            modalVisible: false
        };
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    onOptionClick(e) {
        this.setState({
            allowSelectArchive: (e.target.value === "existing"),
            currentOption: e.target.value
        });
    }

    render() {
        console.log("Dialog allow", this.state.allowSelectArchive);
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
                        </div>
                        <div className="explorer">
                            <RemoteFileExplorer
                                fs={this.props.fs}
                                allowSelectArchive={this.state.allowSelectArchive}
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

}

module.exports = ConnectArchiveDialog;
