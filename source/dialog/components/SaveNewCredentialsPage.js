import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { H5, Classes, Button, Intent } from "@blueprintjs/core";
import InPagePopupBody from "./InPagePopupBody.js";

class SaveNewCredentialsPage extends Component {
    static propTypes = {
        cancelSavingCredentials: PropTypes.func.isRequired,
        disableSavePrompt: PropTypes.func.isRequired,
        fetchCredentials: PropTypes.func.isRequired,
        openSaveForm: PropTypes.func.isRequired
    };

    state = {
        credentialsTitle: "\u2026"
    };

    componentDidMount() {
        this.props.fetchCredentials().then(items => {
            const [item] = items;
            this.setState({
                credentialsTitle: item.title
            });
        });
    }

    handleCancelClick(event) {
        event.preventDefault();
        this.props.cancelSavingCredentials();
    }

    handleDisableClick(event) {
        event.preventDefault();
        this.props.disableSavePrompt();
    }

    handleSaveClick(event) {
        event.preventDefault();
        this.props.openSaveForm();
    }

    render() {
        return (
            <InPagePopupBody
                title="Save Login Details?"
                footer={
                    <Fragment>
                        <Button
                            fill
                            text="Save"
                            icon="floppy-disk"
                            onClick={evt => this.handleSaveClick(evt)}
                            intent={Intent.PRIMARY}
                        />
                        <Button small icon="disable" onClick={evt => this.handleDisableClick(evt)} />
                        <Button fill text="Cancel" onClick={evt => this.handleCancelClick(evt)} />
                    </Fragment>
                }
            >
                <H5 className={Classes.TEXT_MUTED}>{this.state.credentialsTitle}</H5>
            </InPagePopupBody>
        );
    }
}

export default SaveNewCredentialsPage;
