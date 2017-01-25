import {
    el,
    mount
} from "redom";
import { EventEmitter } from "events";

import matching from "./matching";
import config from "../common/config";

import ICON_SEARCH from "../common/images/search.png";
import ICON_SAVE from "../common/images/save.png";
import ICON_KEY from "../common/images/key.png";

const BUTTON_SIZE = 30;
const BUTTON_IMAGE_SIZE = 24;
const LIST_ITEM_HEIGHT = 28;
const MIN_WIDTH = 150;

function createPopup(popup, position, width) {
    const HEIGHT = 130;
    let popupWidth = Math.max(width, MIN_WIDTH);
    let list = el(
        "div",
        {
            "data-buttercup-role": "listbox",
            style: {
                width: "100%",
                height: `${HEIGHT - BUTTON_SIZE}px`,
                position: "absolute",
                left: "0px",
                top: `${BUTTON_SIZE + 1}px`,
                overflowX: "hidden",
                overflowY: "scroll"
            }
        }
    );
    let searchButton = el(
        "div",
        {
            title: "Search entries",
            "data-buttercup-role": "button",
            style: {
                width: `${BUTTON_SIZE}px`,
                height: `${BUTTON_SIZE}px`,
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                backgroundImage: `url(${ICON_SEARCH})`,
                backgroundSize: `${BUTTON_IMAGE_SIZE}px`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }
        }
    );
    let saveButton = el(
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
                backgroundRepeat: "no-repeat"
            }
        }
    );
    let container = el(
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
                overflow: "hidden"
            }
        },
        el(
            "div",
            {
                "data-buttercup-role": "header",
                style: {
                    width: "100%",
                    height: `${BUTTON_SIZE}px`,
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
                }
            },
            searchButton,
            saveButton
        ),
        list
    );
    // events
    popup.attachHoverEvents(searchButton);
    popup.attachHoverEvents(saveButton);
    return {
        root: container,
        list
    };
}

class Popup extends EventEmitter {

    constructor(loginForm) {
        super();
        this._form = loginForm;
        this._elements = null;
        this._removeListeners = null;
    }

    get elements() {
        return this._elements;
    }

    get open() {
        return this._elements !== null;
    }

    attachHoverEvents(element) {
        element.addEventListener("mouseenter", (event) => this.onButtonHover(event, true), false);
        element.addEventListener("mouseleave", (event) => this.onButtonHover(event, false), false);
    }

    close() {
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
        return matching.getItemsForCurrentURL();
    }

    onButtonHover(event, inside) {
        event.preventDefault();
        event.stopPropagation();
        let { target } = event;
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
        setTimeout(() => {
            this._elements = createPopup(this, position, width);
            mount(document.body, this._elements.root);
            this.getItemsForPage().then(items => this.updatePageItems(items));
            let onClick = (e) => {
                if (this._elements && this._elements.root.contains(e.target)) {
                    e.stopPropagation();
                    return;
                }
                this.close();
            };
            document.body.addEventListener("click", onClick, false);
            this._removeListeners = () => document.body.removeEventListener("click", onClick, false);
        }, 50);
    }

    updatePageItems(items) {
        console.log("Items", items);
        this.elements.list.innerHTML = "";
        let listEl = el(
            "ul",
            {
                style: {
                    margin: "0px",
                    padding: "0px",
                    listStyleType: "none"
                }
            }
        );
        mount(this.elements.list, listEl);
        items.forEach((item) => {
            let listItem = el("li", {
                style: {
                    cursor: "pointer",
                    color: "#FFF",
                    fontFamily: "Buttercup-OpenSans",
                    height: `${LIST_ITEM_HEIGHT}px`,
                    lineHeight: `${LIST_ITEM_HEIGHT}px`,
                    paddingLeft: "30px",
                    backgroundImage: `url(${ICON_KEY})`,
                    backgroundSize: "20px",
                    backgroundPosition: "5px 50%",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(0, 0, 0, 0.0)"
                }
            }, item.title);
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
