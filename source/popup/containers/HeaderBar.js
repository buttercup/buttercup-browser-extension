import { connect } from "react-redux";
import { push } from "react-router-redux";
import HeaderBar from "../components/HeaderBar.js";
import { getArchives, getCurrentArchive } from "../../shared/selectors/archives.js";
import { setCurrentVaultContext } from "../../shared/library/messaging.js";

export default connect(
    (state, ownProps) => ({
        archives: getArchives(state),
        currentArchive: getCurrentArchive(state)
    }),
    {
        onItemsClick: () => dispatch => {
            dispatch(push("/entries"));
        },
        onMenuClick: () => dispatch => {
            dispatch(push("/menu"));
        },
        onVaultsClick: () => dispatch => {
            dispatch(push("/"));
        },
        onCurrentVaultChange: vaultId => () => {
            setCurrentVaultContext(vaultId);
        }
    }
)(HeaderBar);
