import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Spinner } from "@blueprintjs/core";
import { VaultProvider, VaultUI } from "@buttercup/ui";
import { getAttachmentData } from "../library/messaging.js";

// @TODO maybe move this somewhere better?
import "@buttercup/ui/dist/styles.css";

const Loader = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

class VaultEditor extends Component {
    static propTypes = {
        attachments: PropTypes.bool.isRequired,
        dynamicIconsSetting: PropTypes.string.isRequired,
        fetchVaultFacade: PropTypes.func.isRequired,
        handlePreviewAttachmentError: PropTypes.func.isRequired,
        saveVaultFacade: PropTypes.func.isRequired,
        sourceID: PropTypes.string.isRequired,
        vault: PropTypes.object
    };

    state = {
        attachmentPreviews: {},
        masterPassword: ""
    };

    componentDidMount() {
        this.props.fetchVaultFacade(this.props.sourceID);
    }

    fetchPreview(entryID, attachmentID) {
        getAttachmentData(this.props.sourceID, entryID, attachmentID)
            .then(base64 => {
                this.setState({
                    attachmentPreviews: {
                        [attachmentID]: base64
                    }
                });
            })
            .catch(err => {
                this.props.handlePreviewAttachmentError(err);
            });
    }

    render() {
        return (
            <Choose>
                <When condition={this.props.vault}>
                    <VaultProvider
                        attachments={this.props.attachments}
                        attachmentPreviews={this.state.attachmentPreviews}
                        icons={this.props.dynamicIconsSetting === "enabled"}
                        onAddAttachments={(entryID, files) =>
                            this.props.addAttachments(this.props.sourceID, entryID, files)
                        }
                        onDeleteAttachment={(entryID, attachmentID) =>
                            this.props.deleteAttachment(this.props.sourceID, entryID, attachmentID)
                        }
                        onDownloadAttachment={(entryID, attachmentID) =>
                            this.props.downloadAttachment(this.props.sourceID, entryID, attachmentID)
                        }
                        onPreviewAttachment={(entryID, attachmentID) => this.fetchPreview(entryID, attachmentID)}
                        onUpdate={vault => this.props.saveVaultFacade(this.props.sourceID, vault)}
                        vault={this.props.vault}
                    >
                        <VaultUI />
                    </VaultProvider>
                </When>
                <Otherwise>
                    <Loader>
                        <Spinner />
                    </Loader>
                </Otherwise>
            </Choose>
        );
    }
}

export default VaultEditor;
