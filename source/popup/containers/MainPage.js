import { connect } from "react-redux";
import MainPage from "../components/MainPage.js";
import { toggleMenu } from "../actions/popupMenu.js";
import { getMenuState } from "../selectors/popupMenu.js";
import { getArchives } from "../../shared/selectors/archives.js";

const NOOP = () => {};

// function getArchives(state) {
// return [
//     {
//         id: "1",
//         title: "Perry's archive",
//         type: "owncloud",
//         state: "unlocked"
//     },
//     {
//         id: "2",
//         title: "Sallar's archive",
//         type: "dropbox",
//         state: "pending"
//     },
//     {
//         id: "3",
//         title: "Testing",
//         type: "nextcloud",
//         state: "locked"
//     },
//     {
//         id: "4",
//         title: "Perry's archive",
//         type: "owncloud",
//         state: "unlocked"
//     },
//     {
//         id: "5",
//         title: "Sallar's archive",
//         type: "dropbox",
//         state: "pending"
//     },
//     {
//         id: "6",
//         title: "Testing",
//         type: "nextcloud",
//         state: "locked"
//     },
//     {
//         id: "7",
//         title: "Perry's archive",
//         type: "owncloud",
//         state: "unlocked"
//     },
//     {
//         id: "8",
//         title: "Sallar's archive",
//         type: "dropbox",
//         state: "pending"
//     },
//     {
//         id: "9",
//         title: "Testing",
//         type: "nextcloud",
//         state: "locked"
//     }
// ];
// }

// chrome.tabs.create(
//     { url: chrome.extension.getURL("setup.html#/unlockArchive/" + encodeURIComponent(this.props.name)) },
//     NOPE
// );

export default connect(
    (state, ownProps) => ({
        archives: getArchives(state),
        menuState: getMenuState(state)
    }),
    {
        onAddArchiveClick: () => () => {
            chrome.tabs.create({ url: chrome.extension.getURL("setup.html#/add-archive/") }, NOOP);
        },
        onMenuClick: () => dispatch => {
            dispatch(toggleMenu());
        }
    }
)(MainPage);
