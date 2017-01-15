"use strict";

const React = require("react");
const Rodal = require("rodal").default;
const Spinner = require("react-spinner");

require("rodal/lib/rodal.css");
require("react-spinner/react-spinner.css");
require("RemoteFileExplorer.sass");

class RemoteFileExplorer extends React.Component {

    constructor(props) {
        super(props);
        this._fsInstance = this.props.fs || null;
        this.state = {
            modalVisible: false
        };
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    render() {
        return (
            <div>
                <button onClick={(e) => this.show(e)}>Browse</button>
                <Rodal visible={this.state.modalVisible} onClose={() => this.hide()}>
                    <div className="modalContents">
                        <Spinner />
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

module.exports = RemoteFileExplorer;
