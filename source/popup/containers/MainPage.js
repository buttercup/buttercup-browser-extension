import { connect } from "react-redux";
import MainPage from "../components/MainPage.js";
import { toggleMenu } from "../actions/popupMenu.js";
import { getMenuState } from "../selectors/popupMenu.js";
import { getArchives } from "../../shared/selectors/archives.js";

const NOOP = () => {};

export default connect(
    (state, ownProps) => ({
        archives: getArchives(state),
        menuState: getMenuState(state)
    }),
    {
        onAddArchiveClick: () => () => {
            chrome.tabs.create({ url: chrome.extension.getURL("setup.html#/add-archive/") }, NOOP);
        },
        onArchiveClick: archiveID => () => {
            chrome.tabs.create({ url: chrome.extension.getURL(`setup.html#/access-archive/${archiveID}`) }, NOOP);
        },
        onMenuClick: () => dispatch => {
            dispatch(toggleMenu());
        },
        onOtherSoftwareClick: () => () => {
            chrome.tabs.create({ url: "https://buttercup.pw" }, NOOP);
        }
    }
)(MainPage);
