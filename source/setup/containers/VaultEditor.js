import { connect } from "react-redux";
import VaultEditor from "../components/VaultEditor.js";
import { setVaultFacade } from "../actions/vault.js";
import { getVaultFacade } from "../selectors/vault.js";
import { addAttachments, applyArchiveFacade, deleteAttachment, getArchiveFacade } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { arrayBufferToBase64 } from "../../shared/library/buffer.js";

async function convertAttachmentFiles(files) {
    const output = [];
    for (const file of files) {
        const data = arrayBufferToBase64(await file.arrayBuffer());
        output.push({
            data,
            name: file.name,
            type: file.type || "application/octet-stream"
        });
    }
    return output;
}

export default connect(
    (state, ownProps) => ({
        vault: getVaultFacade(state)
    }),
    {
        addAttachments: (sourceID, entryID, files) => dispatch => {
            dispatch(setBusy("Adding attachments"));
            convertAttachmentFiles(files)
                .then(convertedFiles => addAttachments(sourceID, entryID, convertedFiles))
                .then(() =>
                    getArchiveFacade(sourceID).then(facade => {
                        dispatch(setVaultFacade(facade));
                    })
                )
                .then(() => {
                    dispatch(unsetBusy());
                    notifySuccess("Attachments added", `Successfully added ${files.length} attachments`);
                })
                .catch(err => {
                    console.error(err);
                    dispatch(unsetBusy());
                    notifyError("Failed adding attachments", err.message);
                });
        },
        deleteAttachment: (sourceID, entryID, attachmentID) => dispatch => {
            dispatch(setBusy("Deleting attachment"));
            deleteAttachment(sourceID, entryID, attachmentID)
                .then(() =>
                    getArchiveFacade(sourceID).then(facade => {
                        dispatch(setVaultFacade(facade));
                    })
                )
                .then(() => {
                    dispatch(unsetBusy());
                    notifySuccess("Attachment deleted", `Successfully deleted the attachment`);
                })
                .catch(err => {
                    console.error(err);
                    dispatch(unsetBusy());
                    notifyError("Failed deleting attachment", err.message);
                });
        },
        downloadAttachment: (sourceID, entryID, attachmentID) => dispatch => {},
        fetchVaultFacade: sourceID => dispatch => {
            getArchiveFacade(sourceID)
                .then(facade => {
                    dispatch(setVaultFacade(facade));
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Failed fetching archive", `Unable to fetch archive (${sourceID}): ${err.message}`);
                });
        },
        handlePreviewAttachmentError: err => () => {
            console.error(err);
            notifyError("Failed fetching attachment preview", err.message);
        },
        saveVaultFacade: (sourceID, facade) => dispatch => {
            dispatch(setBusy("Saving vault"));
            applyArchiveFacade(sourceID, facade)
                .then(() => getArchiveFacade(sourceID))
                .then(updatedFacade => {
                    dispatch(setVaultFacade(updatedFacade));
                })
                .then(() => {
                    dispatch(unsetBusy());
                    notifySuccess("Save successful", "Successfully updated the vault");
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Failed updating archive", `Unable to update archive (${sourceID}): ${err.message}`);
                    dispatch(unsetBusy());
                });
        }
    }
)(VaultEditor);
