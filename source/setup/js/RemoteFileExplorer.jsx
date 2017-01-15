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
            dirContents: null,
            modalVisible: false,
            remotePath: "/"
        };
    }

    get fs() {
        return this.props.fs;
    }

    componentWillReceiveProps() {
        if (this.fs) {
            this.fetchDirectory();
        }
    }

    fetchDirectory() {
        this.fs
            .readDirectory(this.state.remotePath)
            .then(contents => {
                console.log("Remote contents", contents);
                this.setState({
                    dirContents: contents
                });
            })
            .catch(err => {
                alert(`An error occurred fetching Dropbox contents: ${err.message}`);
            });
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
                        {this.state.dirContents === null ?
                            <Spinner /> :
                            <div>
                                <pre>
                                    {JSON.stringify(this.state.dirContents, undefined, 4)}
                                </pre>
                            </div>
                        }
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
