import { connect } from "react-redux";
import { push } from "react-router-redux";
import HeaderBar from "../components/HeaderBar.js";
import { getArchives, getCurrentArchive } from "../../shared/selectors/archives.js";
import { setCurrentVaultContext } from "../../shared/library/messaging.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

export default connect(
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
        onLockAllClick: () => () => {
            createNewTab(getExtensionURL("setup.html#/lock-archives"));
        },
        onOtherSoftwareClick: () => () => {
            createNewTab("https://buttercup.pw");
        }
    }
)(HeaderBar);
