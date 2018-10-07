import { connect } from "react-redux";
import { push } from "react-router-redux";
import { withRouter } from "react-router";
import HeaderBar from "../components/HeaderBar.js";
import { getArchives, getCurrentArchive } from "../../shared/selectors/archives.js";
import { setCurrentVaultContext } from "../../shared/library/messaging.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

export default withRouter(
    connect(
        (state, ownProps) => ({
            archives: getArchives(state),
            currentArchive: getCurrentArchive(state)
        }),
        {
            onItemsClick: () => dispatch => {
                dispatch(push("/"));
            },
            onVaultsClick: () => dispatch => {
                dispatch(push("/vaults"));
            },
            onCurrentVaultChange: vaultId => () => {
                setCurrentVaultContext(vaultId);
            },
            onAddArchiveClick: () => () => {
                createNewTab(getExtensionURL("setup.html#/add-archive"));
            },
            onLockAllClick: () => dispatch => {
                dispatch(push("/vaults/lock", { lockAll: true }));
            },
            onOtherSoftwareClick: () => () => {
                createNewTab("https://buttercup.pw");
            }
        }
    )(HeaderBar)
);
