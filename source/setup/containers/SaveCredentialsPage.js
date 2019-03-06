import { connect } from "react-redux";
import VError from "verror";
import { Group } from "../../shared/library/buttercup.js";
import SaveCredentialsPage from "../components/SaveCredentialsPage.js";
import { getArchives } from "../../shared/selectors/archives.js";
import { addNewEntry, clearLastLogin, getArchivesGroupTree, getLastLogin } from "../library/messaging.js";
import { notifyError, notifySuccess, notifyWarning } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

function processArchives(state) {
    return getArchives(state).filter(archiveSource => archiveSource.state === "unlocked");
}

function processGroups(groups) {
    const groupIsTrash = group => {
        const attributes = group.attributes || {};
        return attributes[Group.Attributes.Role] === "trash";
    };
    return groups.filter(group => !groupIsTrash(group)).map(group => ({
        id: group.id,
        title: group.title,
        groups: processGroups(group.groups || [])
    }));
}

function stringsAreSet(...strings) {
    return strings.every(str => str.trim().length > 0);
}

export default connect(
    (state, ownProps) => ({
        archives: processArchives(state)
    }),
    {
        cancel: () => () => {
            clearLastLogin();
            setTimeout(closeCurrentTab, 100);
        },
        fetchGroupsForArchive: sourceID => () => {
            return getArchivesGroupTree(sourceID)
                .then(processGroups)
                .catch(err => {
                    notifyError("Failed getting archive contents", `An error occurred: ${err.message}`);
                    console.error(err);
                    return [];
                });
        },
        fetchLoginDetails: () => () => getLastLogin(),
        saveNewCredentials: (sourceID, groupID, entryDetails) => dispatch => {
            if (sourceID && groupID) {
                const { username, password, title, url } = entryDetails;
                if (stringsAreSet(username, password, title)) {
                    dispatch(setBusy("Saving credentials..."));
                    addNewEntry(sourceID, groupID, entryDetails)
                        .then(() => {
                            notifySuccess("Save successful", "Successfully saved new credentials.");
                            clearLastLogin();
                            dispatch(unsetBusy());
                            setTimeout(() => {
                                closeCurrentTab();
                            }, 1000);
                        })
                        .catch(err => {
                            dispatch(unsetBusy());
                            const { authFailure = false } = VError.info(err);
                            if (authFailure) {
                                notifyWarning(
                                    "Authorisation failed",
                                    "The credentials were invalid - re-authenticating"
                                );
                            } else {
                                notifyError("Failed saving credentials", err.message);
                            }
                            console.error(err);
                        });
                } else {
                    notifyWarning(
                        "Unable to save credentials",
                        "The username, password and title fields must be entered."
                    );
                }
            } else {
                notifyWarning("Unable to save credentials", "Both the archive source and target group must be chosen.");
            }
        }
    }
)(SaveCredentialsPage);
