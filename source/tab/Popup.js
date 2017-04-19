import {
    el,
    mount
} from "redom";
import { EventEmitter } from "events";

import matching from "./matching";
import config from "../common/config";

// import ICON_SEARCH from "../common/images/search.png";
import ICON_SAVE from "../common/images/save.png";
import ICON_KEY from "../common/images/key.png";
import ICON_SEARCHBAR from "../common/images/searchbar.png";

const BUTTON_SIZE = 30;
const BUTTON_IMAGE_SIZE = 24;
const ICON_SEARCH_IMAGE_SIZE = 18;
const LIST_ITEM_HEIGHT = 44;
const MIN_WIDTH = 300;

function createPathElement(archiveName, groupNames, overrideStyles = {}) {
    const createSpacer = () => el(
        "span",
        {
            style: {
                color: "rgba(255, 255, 255, 0.4)"
            }
        },
        " ⤑ "
    );
    const archiveEl = el(
        "span",
        {
            style: {
                fontFamily: "Buttercup-OpenSans",
                fontSize: "13px",
                fontWeight: "bold",
                fontStyle: "italic",
                color: "rgba(255, 255, 255, 0.4)"
            }
        },
        `📚 ${archiveName}`
    );
    const pathEls = groupNames.reduce((elements, groupName) => [
        ...elements,
        createSpacer(),
        el(
            "span",
            {
                style: {
                    fontFamily: "Buttercup-OpenSans",
                    fontSize: "13px",
                    fontWeight: "normal",
                    fontStyle: "italic",
                    color: "rgba(255, 255, 255, 0.6)"
                }
            },
            groupName
        )
    ], []);
    return el(
        "div",
        {
            style: {
                ...overrideStyles
            }
        },
        archiveEl,
        ...pathEls
    );
}

function createPopup(popup, position, width, enableButtons = true) {
    const HEIGHT = 250;
    const popupWidth = Math.max(width, MIN_WIDTH);
    const buttonStyle = enableButtons ? {} : {
        "-webkit-filter": "grayscale(1)",
        filter: "grayscale(1)"
    };
    const list = el(
        "div",
        {
            "data-buttercup-role": "listbox",
            style: {
                width: "100%",
                height: `${HEIGHT - (BUTTON_SIZE * 2) - 2}px`,
                position: "absolute",
                left: "0px",
                top: `${(BUTTON_SIZE * 2) + 1}px`,
                overflowX: "hidden",
                overflowY: "scroll"
            }
        }
    );
    const saveButton = el(
        "div",
        {
            title: "Save next login",
            "data-buttercup-role": "button",
            style: {
                width: `${BUTTON_SIZE}px`,
                height: `${BUTTON_SIZE}px`,
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                backgroundImage: `url(${ICON_SAVE})`,
                backgroundSize: `${BUTTON_IMAGE_SIZE}px`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                ...buttonStyle
            }
        }
    );
    const header = el(
        "div",
        {
            "data-buttercup-role": "header",
            style: {
                width: "100%",
                height: `${BUTTON_SIZE}px`,
                position: "absolute",
                left: "0px",
                top: "0px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                textAlign: "right"
            }
        },
        saveButton
    );
    const searchInput = el(
        "input",
        {
            style: {
                backgroundColor: "rgba(0, 0, 0, 0.0)",
                width: "100%",
                height: "100%",
                color: "#FFF",
                fontStyle: "italic",
                outline: "none",
                border: "none",
                textIndent: "30px"
            }
        }
    );
    const searchBar = el(
        "div",
        {
            style: {
                backgroundImage: `url(${ICON_SEARCHBAR})`,
                backgroundSize: `${ICON_SEARCH_IMAGE_SIZE}px`,
                backgroundPosition: "5px 3px",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: `${BUTTON_SIZE}px`,
                position: "absolute",
                left: "0px",
                top: `${BUTTON_SIZE}px`,
                borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
            }
        },
        searchInput
    );
    const title = el(
        "div",
        {
            "data-buttercup-role": "title",
            style: {
                fontFamily: "Buttercup-OpenSans",
                color: config.BUTTERCUP_GREEN,
                fontSize: "19px",
                position: "absolute",
                left: "5px",
                top: "2px"
            }
        },
        "Buttercup"
    );
    const container = el(
        "div",
        {
            "data-buttercup-role": "container",
            style: {
                border: "1px solid #000",
                borderRadius: "2px",
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: "absolute",
                width: `${popupWidth}px`,
                height: `${HEIGHT}px`,
                backgroundColor: config.BACKGROUND_DARK_TRANSPARENT,
                overflow: "hidden",
                zIndex: 9999999
            }
        },
        title,
        header,
        searchBar,
        list
    );
    // events
    // popup.attachHoverEvents(searchButton);
    popup.attachHoverEvents(saveButton);
    return {
        root: container,
        list,
        header,
        searchInput
    };
}

class Popup extends EventEmitter {

    constructor(loginForm) {
        super();
        this._form = loginForm;
        this._elements = null;
        this._removeListeners = null;
        this._archiveReady = false;
        this._searchText = "";
    }

    get elements() {
        return this._elements;
    }

    get hasArchiveReady() {
        return this._archiveReady;
    }

    get open() {
        return this._elements !== null;
    }

    attachHoverEvents(element) {
        element.addEventListener("mouseenter", (event) => this.onButtonHover(event, true), false);
        element.addEventListener("mouseleave", (event) => this.onButtonHover(event, false), false);
    }

    close() {
        this._searchText = "";
        if (this._elements) {
            document.body.removeChild(this._elements.root);
        }
        if (this._removeListeners) {
            this._removeListeners();
        }
        this._elements = null;
        this._removeListeners = null;
    }

    getItemsForPage() {
        // return Promise.resolve([
        //     { title: "My login" },
        //     { title: "My login 2" },
        //     { title: "My login 3" },
        //     { title: "My login 4" },
        //     { title: "My login 5" },
        //     { title: "My login 6" },
        //     { title: "My login 7" }
        // ]);
        return (this._searchText.length > 0) ?
            matching.getItemsForSearchQuery(this._searchText) :
            matching.getItemsForCurrentURL();
    }

    onButtonHover(event, inside) {
        event.preventDefault();
        event.stopPropagation();
        const { target } = event;
        if (inside) {
            target.style.backgroundColor = `${config.BACKGROUND_BUTTERCUP_GREEN}`;
        } else {
            target.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
        }
    }

    popup(position, width) {
        if (this._elements) {
            this.close();
        }
        const updateItems = () => this.getItemsForPage().then(items => this.updatePageItems(items));
        setTimeout(() => {
            this._elements = createPopup(this, position, width, this.hasArchiveReady);
            mount(document.body, this._elements.root);
            // handle searching
            this._elements.searchInput.focus();
            const onSearchUpdate = (e) => {
                this._searchText = e.target.value;
                updateItems();
            };
            this._elements.searchInput.oninput = onSearchUpdate;
            // update items
            updateItems();
            // close click
            const onClick = (e) => {
                if (this._elements && this._elements.root.contains(e.target)) {
                    e.stopPropagation();
                    return;
                }
                this.close();
            };
            document.body.addEventListener("click", onClick, false);
            // destruction
            this._removeListeners = () => document.body.removeEventListener("click", onClick, false);
        }, 50);
    }

    updatePageItems(items) {
        this.elements.list.innerHTML = "";
        const emptyMessage = (this._searchText.length > 0) ?
            "No entries found for this search" :
            "No entries for this page";
        if (items.length <= 0) {
            mount(this.elements.list, el(
                "div",
                {
                    style: {
                        width: "100%",
                        color: "#CCC",
                        fontFamily: "Buttercup-OpenSans",
                        fontSize: "15px",
                        fontStyle: "italic",
                        textAlign: "center",
                        marginTop: "5px"
                    }
                },
                emptyMessage
            ));
            return;
        }
        const listEl = el(
            "div",
            {
                style: {
                    margin: "0px",
                    padding: "0px" // ,
                    // listStyleType: "none"
                }
            }
        );
        mount(this.elements.list, listEl);
        items.forEach(item => {
            const listItem = el(
                "div",
                {
                    style: {
                        cursor: "pointer",
                        backgroundImage: `url(${ICON_KEY})`,
                        backgroundSize: "20px",
                        backgroundPosition: "5px 2px",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "rgba(0, 0, 0, 0.0)",
                        height: `${LIST_ITEM_HEIGHT}px`,
                        margin: "0",
                        overflow: "hidden",
                        position: "relative",
                        width: "100%"
                    }
                },
                el(
                    "span",
                    {
                        style: {
                            color: "#FFF",
                            fontFamily: "Buttercup-OpenSans",
                            position: "absolute",
                            left: "30px",
                            top: "2px",
                            lineHeight: "19px",
                            fontSize: "18px",
                            fontStyle: "normal"
                        }
                    },
                    item.title
                ),
                createPathElement(item.archiveName, item.entryPath, {
                    position: "absolute",
                    top: "22px",
                    left: "28px",
                    width: "100%",
                    height: "20px"
                })
            );
            mount(listEl, listItem);
            listItem.addEventListener("click", () => {
                this.close();
                this.emit("entryClick", item);
            }, false);
            this.attachHoverEvents(listItem);
        });
    }

}

export default Popup;
