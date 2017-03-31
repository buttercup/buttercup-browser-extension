import React from "react";

class UnlockArchiveForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            password: ""
        };
    }

    enable(en = true) {
        this.setState({ loading: !en });
    }

    handlePasswordChange(event) {
        let input = event.target,
            value = input.value;
        this.setState({
            password: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.enable(false);
        let archiveDetails = {
            password: this.state.password,
            name: this.props.name
        };
        chrome.runtime.sendMessage({ command: "unlock-archive", data: archiveDetails }, (response) => {
            if (response && response.ok === true) {
                if (this.props.onUnlock) {
                    this.props.onUnlock();
                } else {
                    alert("The archive was unlocked, but the application encountered a critical error and cannot continue");
                }
            } else {
                // @todo error
                alert("There was an error unlocking the archive:\n" + response.error);
                this.enable(true);
            }
        });
    }

    render() {
        return <form className="buttercup">
            <fieldset disabled={this.state.loading}>
                <div className="row">
                    <input
                    type="password"
                    name="password"
                    value={this.props.password}
                    onChange={(e) => this.handlePasswordChange(e)}
                    />
                    <label htmlFor="password">Master password</label>
                </div>
                <div className="row">
                    <button onClick={(e) => this.handleSubmit(e)}>
                        Unlock
                    </button>
                </div>
            </fieldset>
        </form>;
    }

}

export default UnlockArchiveForm;
