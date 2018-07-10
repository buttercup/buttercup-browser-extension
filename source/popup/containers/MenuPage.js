import { connect } from "react-redux";
import MenuPage from "../components/MenuPage.js";
import { createNewTab, getExtensionURL } from "../../shared/library/extension.js";

const NOOP = () => {};

export default connect((state, ownProps) => ({}), {
    onAddArchiveClick: () => () => {
        createNewTab(getExtensionURL("setup.html#/add-archive"));
    },
    onLockAllClick: () => () => {
        createNewTab(getExtensionURL("setup.html#/lock-archives"));
    },
    onOtherSoftwareClick: () => () => {
        createNewTab("https://buttercup.pw");
    }
})(MenuPage);
