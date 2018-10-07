import { connect } from "react-redux";
import { withRouter } from "react-router";
import ArchivesListPage from "../components/ArchivesListPage.js";
import { getArchives } from "../../shared/selectors/archives.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

export default withRouter(
    connect(
        (state, ownProps) => ({
            archives: getArchives(state)
        }),
        {
            onArchiveClick: (archiveID, state) => () => {
                createNewTab(getExtensionURL(`setup.html#/access-archive/${archiveID}/${state}`));
            },
            onAddArchiveClick: () => () => {
                createNewTab(getExtensionURL("setup.html#/add-archive"));
            }
        }
    )(ArchivesListPage)
);
