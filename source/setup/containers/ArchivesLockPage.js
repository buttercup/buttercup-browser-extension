import { connect } from "react-redux";
import ArchivesLockPage from "../components/ArchivesLockPage.js";
import { lockAllArchives } from "../library/messaging.js";
import { notifyError, notifySuccess } from "../library/notify.js";
import { closeCurrentTab } from "../../shared/library/extension.js";

export default connect(
    (state, ownProps) => ({}),
    {
        onReadyToLock: () => () => {
            return lockAllArchives()
                .then(() => {
                    notifySuccess("Archives locked", "Successfully locked archives");
                    setTimeout(() => {
                        closeCurrentTab();
                    }, 1250);
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Failed locking archives", `Unable to lock archives: ${err.message}`);
                });
        }
    }
)(ArchivesLockPage);
