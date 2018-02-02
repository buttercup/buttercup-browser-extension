import { connect } from "react-redux";
import SaveCredentialsPage from "../components/SaveCredentialsPage.js";
import { getArchives } from "../../shared/selectors/archives.js";
import { getArchivesGroupTree, getLastLogin } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { setBusy, unsetBusy } from "../../shared/actions/app.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

function processArchives(state) {
    return getArchives(state).filter(archiveSource => archiveSource.state === "unlocked");
}

function processGroups(groups) {
    return groups.map(group => ({
        id: group.id,
        title: group.title,
        groups: processGroups(group.groups || [])
    }));
}

export default connect(
    (state, ownProps) => ({
        archives: processArchives(state)
    }),
    {
        fetchGroupsForArchive: sourceID => () => {
            return getArchivesGroupTree(sourceID)
                .then(processGroups)
                .catch(err => {
                    notifyError("Failed getting archive contents", `An error occurred: ${err.message}`);
                    console.error(err);
                    return [];
                });
        },
        fetchLoginDetails: () => () => getLastLogin()
    }
)(SaveCredentialsPage);
